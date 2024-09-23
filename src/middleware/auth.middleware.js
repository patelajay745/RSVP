const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const { asynHandler } = require("../utils/asyncHandler");

const verifyJWt = asynHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.split("Bearer ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Todo finish this auth
});
