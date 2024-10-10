const mongoose = require("mongoose");
const { Schema } = mongoose;

const verifySchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        expiry: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

const Verify = mongoose.model("Verify", verifySchema);

module.exports = { Verify };
