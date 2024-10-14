const querystring = require("querystring");
const { User } = require("../../models/user.model");
const connectDb = require("../../db");
const { ApiResponse } = require("../../utils/ApiResponse");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const parsedBody = querystring.parse(event.body);
    const { newPassword } = parsedBody;

    if (!newPassword) {
        return new ApiResponse(400, "Please provide new Password");
    }

    const user = await User.findById(context.user?._id);
    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return new ApiResponse(200, {}, "Password has been updated");
};
