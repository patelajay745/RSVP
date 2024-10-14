const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { ApiResponse } = require("../utils/ApiResponse");
const connectDb = require("../db");

connectDb(process.env.MONGODB_URI);

module.exports.authenticate = async (event, context) => {
    const cookies = event.headers.Cookie;

    let accessToken;
    if (cookies) {
        const cookieArray = cookies.split(";");
        for (let cookie of cookieArray) {
            const [name, value] = cookie.trim().split("=");
            if (name === "accessToken") {
                if (value != "{}") accessToken = value;
                break;
            }
        }
    }

    const authHeader = event.headers.Authorization;
    const tokenFromHeader = authHeader ? authHeader.split("Bearer ")[1] : null;

    const token = accessToken || tokenFromHeader;

    if (!token) {
        context.end();
        return new ApiResponse(401, "Unauthorized request");
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ _id: decodeToken._id }).select(
        "-password -__v -createdAt -updatedAt -refreshToken"
    );

    if (!user) {
        context.end();
        return new ApiResponse(400, "Invalid Token");
    }

    context.user = user;
};
