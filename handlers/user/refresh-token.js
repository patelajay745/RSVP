const querystring = require("querystring");
const { ApiResponse } = require("../../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user.model");
const connectDb = require("../../db");
const {
    generateAccessTokenAndRefreshToken,
} = require("../../utils/tokenGenerate");

connectDb(process.env.MONGODB_URI);

module.exports.handler = async (event, context) => {
    const parsedBody = querystring.parse(event.body);

    const cookies = event.headers.Cookie;
    let oldRefreshToken;
    if (cookies) {
        const cookieArray = cookies.split(";");
        for (let cookie of cookieArray) {
            const [name, value] = cookie.trim().split("=");
            if (name === "refreshToken") {
                if (value != "{}") oldRefreshToken = value;
                break;
            }
        }
    }

    const incomingRefreshToken = oldRefreshToken || parsedBody.refreshToken;

    if (!incomingRefreshToken) {
        return new ApiResponse(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findOne({ _id: decodedToken?._id });
    if (!user) {
        return new ApiResponse(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        return new ApiResponse(401, "Refresh Token is expired or used");
    }

    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);
    console.log("accessToken", accessToken);
    console.log("newRefreshToken", refreshToken);

    return new ApiResponse(
        200,
        "access token refreshed",
        {
            accessToken,
            refreshToken,
        },
        null,
        {
            "Set-cookie": [
                `refreshToken=${refreshToken};Secure;HttpOnly;SameSite=Lax;Path=/`,
                `accessToken=${accessToken}; Secure; HttpOnly; SameSite=Lax; Path=/`,
            ],
        }
    );
};
