const { ApiResponse } = require("../../utils/ApiResponse");
const connectDb = require("../../db");
const { Verify } = require("../../models/verify.model");
const querystring = require("querystring");
const { User } = require("../../models/user.model");
connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const parsedBody = querystring.parse(event.body);
    const { code } = parsedBody;

    if (!code) {
        return new ApiResponse(200, "Verification code is required.");
    }

    // check whether is already verified or not
    const user = await User.findOne({ email: context.user.email });

    if (user.confirmed) {
        return new ApiResponse(200, "EmailId is already confirmed");
    }

    // check database with user email and last code
    const verify = await Verify.findOne({ user: user._id }).sort({
        updatedAt: -1,
    });

    if (!verify) {
        return new ApiResponse(
            200,
            "No record found. Please try to send verification email again."
        );
    }

    //  check if code is right
    if (verify.code != code) {
        return new ApiResponse(
            200,
            "verification Code is not correct. Please try again"
        );
    }

    // check expiry
    const currentTime = new Date();
    const expiryTime = new Date(verify.expiry);

    if (currentTime > expiryTime) {
        return new ApiResponse(200, "Code is expired.Please get a new code");
    }

    // update table
    user.confirmed = true;
    user.save();

    const deleted = await Verify.deleteOne({ _id: verify._id });

    return new ApiResponse(200, "Email has been verified successfully ");
};
