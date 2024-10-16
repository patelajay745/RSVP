const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");
connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const { eventId } = event.pathParameters;

    if (!eventId) {
        return new ApiResponse(400, "Please provide eventId");
    }

    const requestedEvent = await Event.findOne({ _id: eventId });

    if (!requestedEvent) {
        return new ApiResponse(400, "No event found with this EventId");
    }

    if (!requestedEvent.createdBy.equals(context.user._id)) {
        return new ApiResponse(401, "Not Authorized");
    }

    let changedTo =
        requestedEvent.status == "published" ? "closed" : "published";

    const updatedEvent = await Event.findByIdAndUpdate(
        { _id: eventId },
        {
            $set: {
                status: changedTo,
            },
        },
        { new: true }
    );

    if (!updatedEvent) {
        return new ApiResponse(500, "Something went wrong");
    }

    const response = {
        id: updatedEvent._id,
        eventName: updatedEvent.eventName,
        status: updatedEvent.status,
    };

    return new ApiResponse(200, "Event has been updated", response);
};
