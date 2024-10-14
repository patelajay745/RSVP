const { ApiResponse } = require("../../utils/ApiResponse");

module.exports.handler = async (event, context) => {
    return new ApiResponse(200, "Current User Fetched", context.user);
};
