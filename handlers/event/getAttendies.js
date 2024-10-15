const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");
const { Family } = require("../../models/family.model");
const { RSVPGuest } = require("../../models/rsvpguest.model");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event) => {
    const { eventId } = event.pathParameters;

    if (!eventId) {
        return new ApiResponse(400, "Please provide eventId");
    }
    const requestedEvent = await Event.findById(eventId);
    if (!requestedEvent) {
        return new ApiResponse(400, "No event found with this eventId");
    }

    const families = await Family.find({ event: eventId });

    if (!families) {
        return new ApiResponse(400, "No families found with this eventId");
    }

    // Initialize counters and arrays
    let attendingCount = 0;
    let notAttendingCount = 0;
    const attendingFamilies = [];
    const notAttendingFamilies = [];

    for (const family of families) {
        const familyAttending = family.numAttendees > 0;

        // Prepare the family object
        const familyObj = {
            firstName: family.firstName,
            lastName: family.lastName,
            guests: !familyAttending ? 0 : [],
        };

        // Fetch and add the RSVP guests
        const guests = await RSVPGuest.find({ familyId: family._id });
        for (const guest of guests) {
            familyObj.guests.push({
                firstName: guest.firstName,
                lastName: guest.lastName,
            });
        }

        // Add the family to the appropriate array
        if (familyAttending) {
            attendingCount += family.numAttendees;
            attendingFamilies.push(familyObj);
        } else {
            notAttendingCount++;
            notAttendingFamilies.push(familyObj);
        }
    }

    const data = {
        attendingFamilies,
        notAttendingFamilies,
        attendingCount,
        notAttendingCount,
    };

    return new ApiResponse(200, "Attendies has been fetched", data);
};
