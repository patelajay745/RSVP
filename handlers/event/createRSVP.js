const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Event } = require("../../models/event.model");

const { Family } = require("../../models/family.model");
const querystring = require("querystring");
const { RSVPGuest } = require("../../models/rsvpguest.model");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event) => {
    
    const parsedBody = JSON.parse(event.body);

    
    

    const { eventId, firstName, lastName, email, numAttendees, attendees } =
        parsedBody;
    if (
        [eventId, firstName, lastName, email].some(
            (field) => (field && field.trim()) == ""
        )
    ) {
        return new ApiResponse(400, "Please provide all required fields");
    }

    const family = await Family.create({
        event: eventId,
        firstName,
        lastName,
        email,
        numAttendees: Number(numAttendees) | 0,
    });

    if (numAttendees == 0) {
        return new ApiResponse(201, "RSVP created sucessfully", family);
    }

    if (numAttendees > 1 && attendees && attendees.length > 0) {
        const guestPromises = attendees.map(async (attendee) => {
            if (!attendee.firstName || !attendee.lastName) {
                return new ApiResponse(
                    400,
                    "Attendee first name and last name are required"
                );
            }
            return RSVPGuest.create({
                familyId: family._id,
                firstName: attendee.firstName,
                lastName: attendee.lastName,
            });
        });

        await Promise.all(guestPromises);
    }

    return new ApiResponse(201, "RSVP created sucessfully", family);
};
