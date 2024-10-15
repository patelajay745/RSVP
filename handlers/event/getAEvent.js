const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const { eventId } = event.pathParameters;

    if (!eventId) {
        return new ApiResponse(400, "Please provide eventId");
    }

    const requestedEvent = await Event.findOne({
        _id: eventId,
        createdBy: context.user._id,
    }).select("-createdBy -createdAt -updatedAt -__v");

    if (!requestedEvent) {
        return new ApiResponse(401, "unAuthorized");
    }

    return new ApiResponse(200, "Event has been fetched", requestedEvent);
};
