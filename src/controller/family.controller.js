const { Family } = require("../models/family.model");
const { RSVPGuest } = require("../models/rsvpguest.model");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asynHandler } = require("../utils/asyncHandler");
const { Event } = require("../models/event.model");

const createFamily = asynHandler(async (req, res) => {
    const { eventId, firstName, lastName, email, numAttendees, attendees } =
        req.body;

    if (
        [eventId, firstName, lastName, email].some(
            (field) => field.trim() == ""
        )
    ) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const family = await Family.create({
        eventId,
        firstName,
        lastName,
        email,
        numAttendees: Number(numAttendees) | 0,
    });

    if (numAttendees == 0) {
        return res
            .status(201)
            .json(new ApiResponse(201, family, "RSVP created sucessfully"));
    }

    if (numAttendees > 1 && attendees && attendees.length > 0) {
        const guestPromises = attendees.map(async (attendee) => {
            if (!attendee.firstName || !attendee.lastName) {
                throw new ApiError(
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

    return res
        .status(201)
        .json(new ApiResponse(201, family, "RSVP created sucessfully"));
});

const deleteFamily = asynHandler(async (req, res) => {
    const { eventId, familyId } = req.params;

    if (!eventId || !familyId) {
        throw new ApiError(400, "Please provide all required fields");
    }

    const event = await Event.findById(eventId);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (!event.createdBy.equals(req.user._id)) {
        throw new ApiError(403, "Not Authorized");
    }

    const family = await Family.findById({ _id: familyId });

    if (!family) {
        throw new ApiError(404, "Family not found");
    }

    await RSVPGuest.deleteMany({ familyId: family._id });
    await Family.deleteOne({ _id: familyId });

    res.status(200).json(new ApiResponse(200, {}, "RSVP deleted successfully"));
});

module.exports = { createFamily, deleteFamily };
