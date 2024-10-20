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
        "Set-cookie": [
            `refreshToken=;Secure;HttpOnly;SameSite=Lax;Path=/`,
            `accessToken=; Secure; HttpOnly; SameSite=Lax; Path=/`,
        ],
    });
};
