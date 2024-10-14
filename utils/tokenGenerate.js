const { ApiResponse } = require("./ApiResponse");
const { User } = require("../models/user.model");
const connectDb = require("../db");

connectDb(process.env.MONGODB_URI);

module.exports.generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        return new ApiResponse(
            500,
            "Something went wrong while generating tokens"
        );
    }
};
