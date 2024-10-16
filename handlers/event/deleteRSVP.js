const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");
const { Family } = require("../../models/family.model");
const { RSVPGuest } = require("../../models/rsvpguest.model");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const { eventId, familyId } = event.pathParameters;

    if (!eventId || !familyId) {
        return new ApiResponse(400, "Please provide all required fields");
    }

    const requestedEvent = await Event.findById(eventId);

    if (!requestedEvent) {
        return new ApiResponse(404, "Event not found");
    }

    if (!requestedEvent.createdBy.equals(context.user._id)) {
        return new ApiResponse(403, "Not Authorized");
    }

    const family = await Family.findById({ _id: familyId });

    if (!family) {
        return new ApiResponse(404, "Family not found");
    }

    await RSVPGuest.deleteMany({ familyId: family._id });
    await Family.deleteOne({ _id: familyId });

    return new ApiResponse(200, "RSVP deleted successfully");
};
