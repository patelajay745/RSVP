// const {}=require()
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { Event } = require("../models/event.model");
const { asynHandler } = require("../utils/asyncHandler");

const createEvent = asynHandler(async (req, res) => {
    const {
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        timezone,
        venueName,
        venueAddress,
        themephoto,
    } = req.body;

    if (
        [
            eventName,
            startDate,
            startTime,
            endDate,
            endTime,
            timezone,
            venueName,
            venueAddress,
            themephoto,
        ].some((field) => field.trim() == "")
    ) {
        throw new ApiError(400, "Please provide All required fields");
    }

    console.log(new Date(startDate).toISOString().split("T")[0]);
    const event = {
        eventName,
        startDate: new Date(startDate).toISOString().split("T")[0], // This will store only the date part (YYYY-MM-DD)
        startTime,
        endDate: new Date(endDate).toISOString().split("T")[0],
        endTime,
        timezone,
        venueName,
        venueAddress,
        themephoto,
        createdBy: req.user?._id,
    };

    let createdEvent = await Event.create(event);

    if (!createEvent) {
        throw new ApiError(500, "Something wrong went while saving data");
    }

    createdEvent = createdEvent.toObject();
    delete createdEvent.createdAt;
    delete createdEvent.updatedAt;
    delete createdEvent.__v;
    delete createEvent.createdBy;

    return res
        .status(201)
        .json(new ApiResponse(200, createdEvent, "Event has been created"));
});

const deleteEvent = asynHandler(async (req, res) => {
    const { eventId } = req.params;
    if (!eventId) {
        throw new ApiError(400, "Please provide EventId");
    }

    const event = await Event.findOne({ _id: eventId });

    if (!event) {
        throw new ApiError(400, "No event found with this EventId");
    }

    if (!event.createdBy.equals(req.user._id)) {
        throw new ApiError(401, "Not Authorized");
    }

    const deletedEvent = await Event.findOneAndDelete({ _id: eventId });

    if (!deletedEvent) {
        throw new ApiError(500, "Something went wrong while deleting event");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Event has beeen deleted"));
});

const toggelPublishedClosed = asynHandler(async (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        throw new ApiError(400, "Please provide EventId");
    }

    const event = await Event.findOne({ _id: eventId });

    if (!event) {
        throw new ApiError(400, "No event found with this EventId");
    }

    if (!event.createdBy.equals(req.user._id)) {
        throw new ApiError(401, "Not Authorized");
    }

    let changedTo = event.status == "published" ? "closed" : "published";

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
        throw new ApiError(500, "Something went wrong");
    }

    const response = {
        id: updatedEvent._id,
        eventName: updatedEvent.eventName,
        status: updatedEvent.status,
    };

    return res
        .status(200)
        .json(new ApiResponse(200, response, "Event has been updated"));
});

const listAllEvents = asynHandler(async (req, res) => {
    const userID = req.user?._id;

    const events = await Event.find({ createdBy: userID });

    if (!events) {
        throw new ApiError(400, "No Events found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, events, "Events are fetched"));
});

const getEvent = asynHandler(async (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        throw new ApiError(400, "Please provide eventId");
    }

    const event = await Event.findOne({
        _id: eventId,
        createdBy: req.user._id,
    }).select("-createdBy -createdAt -updatedAt -__v");

    if (!event) {
        throw new ApiError(401, "unAuthorized");
    }
    console.log(event);

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event has been fetched"));
});

const updateEvent = asynHandler(async (req, res) => {
    //TODO: update Image logic
    const {
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        timezone,
        venueAddress,
        venueName,
    } = req.body;

    const { eventId } = req.params;

    const event = await Event.findOne({
        _id: eventId,
        createdBy: req.user?._id,
    });

    if (!event) {
        throw new ApiError(401, unAthorized);
    }

    if (eventName !== undefined) event.eventName = eventName;
    if (startDate !== undefined) event.startDate = startDate;
    if (startTime !== undefined) event.startTime = startTime;
    if (endDate !== undefined) event.endDate = endDate;
    if (endTime !== undefined) event.endTime = endTime;
    if (timezone !== undefined) event.timezone = timezone;
    if (venueAddress !== undefined) event.venueAddress = venueAddress;
    if (venueName !== undefined) event.venueName = venueName;

    await event.save();

    return res
        .status(200)
        .json(new ApiResponse(200, event, "Event has been updated"));
});

module.exports = {
    createEvent,
    deleteEvent,
    toggelPublishedClosed,
    listAllEvents,
    getEvent,
    updateEvent,
};
