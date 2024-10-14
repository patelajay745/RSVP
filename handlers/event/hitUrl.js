const { ApiResponse } = require("../../utils/ApiResponse");
const { Event } = require("../../models/event.model");
const connectDb = require("../../db");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event) => {
    const { shortUrl } = event.pathParameters;
    // console.log(shortUrl);

    if (!shortUrl) {
        throw new ApiResponse(400, "Please provide shortUrl");
    }

    const requestedEvent = await Event.findOne({ shortUrl }).select(
        "-createdAt -updatedAt -__v"
    );

    if (!requestedEvent) {
        throw new ApiResponse(400, "No event found with this shortUrl");
    }

    return new ApiResponse(200, "Event has been fetched", requestedEvent);
};
