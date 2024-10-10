const { ApiResponse } = require("../../utils/ApiResponse");
const querystring = require("querystring");
const connectDb = require("../../db");
const mongoose = require("mongoose");
const { User } = require("../../models/user.model");
const { Verify } = require("../../models/verify.model");
const AWS = require("aws-sdk");

connectDb(process.env.MONGODB_URI);
const SES = new AWS.SES();

module.exports.handler = async (event) => {
    const parsedBody = querystring.parse(event.body);
    const { firstName, lastName, email, password } = parsedBody;

    if (
        [firstName, lastName, email, password].some(
            (field) => (field || "").trim() === ""
        )
    ) {
        throw new ApiResponse(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiResponse(400, "This email id is already registered");
    }

    let user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    //verification process
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verify = await Verify.create({
        user: user._id,
        code,
        expiry: Date.now() + 3600000,
    });

    const data = `Hi ${firstName},

Thank you for registering! Before we finalize your RSVP, please confirm your email address by entering the verification code below:

Your Confirmation Code:
${code}

Please enter this code in the app/website to verify your email.`;

    const params = {
        Destination: {
            // ToAddresses: ["virangipatel2891@gmail.com"],
            ToAddresses: email,
        },
        Message: {
            Body: {
                Text: {
                    Data: data,
                },
            },
            Subject: { Data: "RSVP Confirmation Code" },
        },
        Source: "patel.ajay745@gmail.com",
    };

    // const response = await SES.sendEmail(params).promise();

    user = user.toObject();
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;

    if (!user) {
        throw new ApiResponse(500, "Problem in registering user");
    }

    throw new ApiResponse(201, "User Registered", user);
};
