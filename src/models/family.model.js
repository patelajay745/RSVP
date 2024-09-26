const mongoose = require("mongoose");
const { Schema } = mongoose;

const familySchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        numAttendees: {
            type: Number,
            default: 0,
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
    },
    { timestamps: true }
);

const Family = mongoose.model("Family", familySchema);

module.exports = { Family };
