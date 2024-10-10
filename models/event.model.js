const mongoose = require("mongoose");
const { Schema } = mongoose;
const { nanoid } = require("nanoid");

const eventSchema = new Schema(
    {
        eventName: {
            type: String,
            required: true,
            maxLength: 20,
        },
        startDate: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        timezone: {
            type: String,
            required: true,
        },
        venueName: {
            type: String,
            required: true,
        },
        venueAddress: {
            type: String,
            required: true,
        },
        themephoto: {
            type: String,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["published", "closed"],
            default: "closed",
        },
        shortUrl: {
            type: String,
            unique: true,
            default: () => {
                return nanoid(6);
            },
        },
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = { Event };
