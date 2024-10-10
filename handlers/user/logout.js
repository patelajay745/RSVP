const { User } = require("../../models/user.model");
const { ApiResponse } = require("../../utils/ApiResponse");

module.exports.handler = async (event, context) => {
    // console.log("context value", context);
    console.log("context value", context.user._id);

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

    throw new ApiResponse(
        200,
        "user logged out",
        {},
        {
            "Set-Cookie": [
                `accessToken=; HttpOnly; Path=/;`,
                `refreshToken=; HttpOnly; Path=/;`,
            ],
        }
    );
};
