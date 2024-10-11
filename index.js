const { ApiResponse } = require("./utils/ApiResponse");

module.exports.handler = async (event) => {
    return new ApiResponse(200, "up and runing");
};
