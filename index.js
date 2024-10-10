const { ApiResponse } = require("./utils/ApiResponse");

module.exports.handler = async (event) => {
    console.log(event);
    // JSON.parse(event.body);
    const res = new ApiResponse(200, {}, "up and running");
    
    return res;
};
