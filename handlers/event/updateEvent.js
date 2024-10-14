const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");
const querystring = require("querystring");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const { eventId } = event.pathParameters;
    const parsedBody = querystring.parse(event.body);

    const {
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        timezone,
        venueAddress,
        venueName,
    } = parsedBody;

    const requestedEvent = await Event.findOne({
        _id: eventId,
        createdBy: context.user?._id,
    });

    if (!requestedEvent) {
        throw new ApiResponse(401, "unAthorized");
    }

    if (eventName !== undefined) requestedEvent.eventName = eventName;
    if (startDate !== undefined) requestedEvent.startDate = startDate;
    if (startTime !== undefined) requestedEvent.startTime = startTime;
    if (endDate !== undefined) requestedEvent.endDate = endDate;
    if (endTime !== undefined) requestedEvent.endTime = endTime;
    if (timezone !== undefined) requestedEvent.timezone = timezone;
    if (venueAddress !== undefined) requestedEvent.venueAddress = venueAddress;
    if (venueName !== undefined) requestedEvent.venueName = venueName;

    await requestedEvent.save();

    return new ApiResponse(200, "Event has been updated", requestedEvent);
};
