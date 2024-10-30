const { User } = require("../../models/user.model");
const { ApiResponse } = require("../../utils/ApiResponse");

module.exports.handler = async (event, context) => {
    // console.log("context value", context);

    const userId = context.user._id;
    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
    return new ApiResponse(200, "user logged out", null, null, {
        "Set-Cookie": [
            "refreshToken=; Secure; HttpOnly; SameSite=None; Path=/; Max-Age=0",
            "accessToken=; Secure; HttpOnly; SameSite=None; Path=/; Max-Age=0",
        ],
    });
};
