const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");
connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const userID = context.user._id;

    const requestedEvents = await Event.aggregate([
        // Match events created by the user
        {
            $match: {
                createdBy: userID,
            },
        },
        // Lookup families for each event
        {
            $lookup: {
                from: "families",
                localField: "_id",
                foreignField: "event",
                as: "families",
            },
        },
        // Add total attendees count
        {
            $addFields: {
                totalAttendees: {
                    $reduce: {
                        input: "$families",
                        initialValue: 0,
                        in: { $add: ["$$value", "$$this.numAttendees"] },
                    },
                },
            },
        },
        // Keep original fields and add totalAttendees
        {
            $project: {
                eventName: 1,
                startDate: 1,
                startTime: 1,
                endDate: 1,
                endTime: 1,
                timezone: 1,
                venueName: 1,
                venueAddress: 1,
                themephoto: 1,
                createdBy: 1,
                status: 1,
                shortUrl: 1,
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                totalAttendees: 1,
            },
        },
    ]);

    if (!requestedEvents) {
        return new ApiResponse(400, "No Events found");
    }

    return new ApiResponse(200, "Events are fetched", requestedEvents);
};
