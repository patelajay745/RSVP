const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");
connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const userID = context.user._id;

    const requestedEvents = await Event.find({ createdBy: userID });

    if (!requestedEvents) {
        return new ApiResponse(400, "No Events found");
    }

    return new ApiResponse(200, "Events are fetched", requestedEvents);
};
