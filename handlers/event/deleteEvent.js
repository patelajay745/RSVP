const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const { eventId } = event.pathParameters;

    if (!eventId) {
        return new ApiResponse(400, "Please provide EventId");
    }

    const requestedEvent = await Event.findOne({ _id: eventId });

    if (!requestedEvent) {
        return new ApiResponse(400, "No event found with this EventId");
    }

    if (!requestedEvent.createdBy.equals(context.user._id)) {
        return new ApiResponse(401, "Not Authorized");
    }

    const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

    if (!deletedEvent) {
        return new ApiResponse(
            500,
            "Something went wrong while deleting event"
        );
    }

    return new ApiResponse(200, {}, "Event has beeen deleted");
};
