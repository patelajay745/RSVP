const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Verify } = require("../../models/verify.model");

const AWS = require("aws-sdk");

connectDb(process.env.MONGODB_URI);
const SES = new AWS.SES();

module.exports.handler = async (event, context) => {
    console.log(context.user);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 3600000;
    const verify = await Verify.create({
        user: context.user._id,
        code,
        expiry,
    });

    console.log(expiry);

    const data = `Hi ${context.user.firstName},

Thank you for registering! Before we finalize your RSVP, please confirm your email address by entering the verification code below:

Your Confirmation Code:
${code}

Please enter this code in the app/website to verify your email.

Code will expiry within an hour`;

    const params = {
        Destination: {
            ToAddresses: [context.user.email],
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

    const response = await SES.sendEmail(params).promise();

    console.log(response);

    return new ApiResponse(200, "Email sent");
};
