const { ApiResponse } = require("../../utils/ApiResponse");

module.exports.handler = async (event, context) => {
    const user = context.user;
    return new ApiResponse(200, "Current User Fetched", {
        user,
        code: "TOKEN_VALID",
    });
};
