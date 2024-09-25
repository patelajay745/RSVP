// const {}=require()
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { Event } = require("../models/event.model");
const { asynHandler } = require("../utils/asyncHandler");

const createEvent = asynHandler(async (req, res) => {
    const {
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        timezone,
        venueName,
        venueAddress,
        themephoto,
    } = req.body;

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
            themephoto,
        ].some((field) => field.trim() == "")
    ) {
        throw new ApiError(400, "Please provide All required fields");
    }

    console.log(new Date(startDate).toISOString().split("T")[0]);
    const event = {
        eventName,
        startDate: new Date(startDate).toISOString().split("T")[0], // This will store only the date part (YYYY-MM-DD)
        startTime,
        endDate: new Date(endDate).toISOString().split("T")[0],
        endTime,
        timezone,
        venueName,
        venueAddress,
        themephoto,
        createdBy: req.user?._id,
    };

    let createdEvent = await Event.create(event);

    if (!createEvent) {
        throw new ApiError(500, "Something wrong went while saving data");
    }

    createdEvent = createdEvent.toObject();
    delete createdEvent.createdAt;
    delete createdEvent.updatedAt;
    delete createdEvent.__v;
    delete createEvent.createdBy;

    return res
        .status(201)
        .json(new ApiResponse(200, createdEvent, "Event has been created"));
});

module.exports = {
    createEvent,
};
