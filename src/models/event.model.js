const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
    {
        eventName: {
            type: String,
            required: true,
            maxLength: 20,
        },
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = { Event };
