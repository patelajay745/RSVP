const mongoose = require("mongoose");
const { Schema } = mongoose;

const rsvpGuestSchema = new Schema(
    {
        familyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Family",
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const RSVPGuest = mongoose.model("RSVPGuest", rsvpGuestSchema);

module.exports = { RSVPGuest };
