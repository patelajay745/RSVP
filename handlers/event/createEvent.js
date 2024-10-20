const { ApiResponse } = require("../../utils/ApiResponse");
module.exports.handler = async (event, context) => {
    if (!context.user.confirmed) {
        return new ApiResponse(200, "Please confirm email id to create event");
    }

    return new ApiResponse(200, "Reached", );
};
