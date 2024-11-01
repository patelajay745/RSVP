const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { ApiResponse } = require("../utils/ApiResponse");
const connectDb = require("../db");

connectDb(process.env.MONGODB_URI);

const ERROR_TYPES = {
    EXPIRED: "TOKEN_EXPIRED",
    INVALID: "TOKEN_INVALID",
    MISSING: "TOKEN_MISSING",
    USERNOTFOUND: "USER_NOT_FOUND",
};

module.exports.authenticate = async (event, context) => {
    const cookies = event.headers.cookie || event.headers.Cookie;

    console.log("Headers:", event.headers); // Debug headers
    console.log("Cookies:", event.headers.cookie); // Debug cookies

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
        return new ApiResponse(401, "Unauthorized request", {
            code: ERROR_TYPES.MISSING,
        });
    }

    let decodeToken;
    try {
        decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        context.end();

        if (error.name === "TokenExpiredError") {
            return new ApiResponse(401, "Token expired", {
                code: ERROR_TYPES.EXPIRED,
            });
        }

        return new ApiResponse(401, "Invalid token", {
            code: ERROR_TYPES.INVALID,
        });
    }

    const user = await User.findOne({ _id: decodeToken._id }).select(
        "-password -__v -createdAt -updatedAt -refreshToken"
    );

    if (!user) {
        context.end();
        return new ApiResponse(401, "Invalid user", {
            code: ERROR_TYPES.USERNOTFOUND,
        });
    }

    context.user = user;
};
