const { ApiResponse } = require("../../utils/ApiResponse");
const querystring = require("querystring");

module.exports.handler = async (event) => {
    const parsedBody = querystring.parse(event.body);
    const { firstName, lastName, email, password } = parsedBody;

    if (
        [firstName, lastName, email, password].some(
            (field) => (field || "").trim() === ""
        )
    ) {
        throw new ApiResponse(400, {}, "All fields are required");
    }

    const res = new ApiResponse(200, {}, "up and running");

    return res;
};
