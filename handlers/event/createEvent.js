const { ApiResponse } = require("../../utils/ApiResponse");
const parser = require("lambda-multipart-parser");
const { uploadOnS3 } = require("../../utils/imageUpload");
const { Event } = require("../../models/event.model");

const connectDb = require("../../db");
connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    // console.log("Eventssssss", event);
    if (!context.user.confirmed) {
        return new ApiResponse(200, "Please confirm email id to create event");
    }
    try {
        console.log("Received event:", {
            headers: event.headers,
            contentType:
                event.headers["Content-Type"] || event.headers["content-type"],
            bodyLength: event.body?.length,
        });
        
        const result = await parser.parse(event);

        const {
            eventName,
            startDate,
            startTime,
            endDate,
            endTime,
            timezone,
            venueName,
            venueAddress,
        } = result;

        if (
            [
                eventName,
                startDate,
                startTime,
                endDate,
                endTime,
                timezone,
                venueName,
                venueAddress,
            ].some((field) => (field && field.trim()) == "")
        ) {
            return new ApiResponse(400, "Please provide All required fields");
        }

        const { err, themephoto } = await uploadOnS3(result.files);

        // Console.log(themephoto);

        if (err) {
            return new ApiResponse(
                500,
                "Something went wrong while uploading image"
            );
        }

        const eventToAdd = {
            eventName,
            startDate: new Date(startDate).toISOString().split("T")[0], // This will store only the date part (YYYY-MM-DD)
            startTime,
            endDate: new Date(endDate).toISOString().split("T")[0],
            endTime,
            timezone,
            venueName,
            venueAddress,
            themephoto: themephoto,
            createdBy: context.user?._id,
        };

        let createdEvent = await Event.create(eventToAdd);

        if (!createdEvent) {
            return new ApiResponse(
                500,
                "Something wrong went while saving data"
            );
        }

        createdEvent = createdEvent.toObject();
        delete createdEvent.createdAt;
        delete createdEvent.updatedAt;
        delete createdEvent.__v;
        delete createdEvent.createdBy;

        return new ApiResponse(200, "Event has been created", createdEvent);
    } catch (error) {
        console.log(error);
        return new ApiResponse(500, "Something wen wrong", error);
    }
};
