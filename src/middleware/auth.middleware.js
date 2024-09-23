const { ApiError } = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const { asynHandler } = require("../utils/asyncHandler");
const { User } = require("../models/user.model");

const verifyJWt = asynHandler(async (req, _, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.split("Bearer ")[1];

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Todo finish this auth

    const user = await User.findOne({ _id: decodeToken._id }).select(
        "-password -__v -createdAt -updatedAt"
    );

    if (!user) {
        throw new ApiError(401, "invalid Token");
    }

    req.user = user;
    next();
});

module.exports = {
    verifyJWt,
};
