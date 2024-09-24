// const {}=require()
const { User } = require("../models/user.model");
const { asynHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asynHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (
        [firstName, lastName, email, password].some(
            (field) => field.trim() == ""
        )
    ) {
        throw new ApiError(400, "All fields are is required ");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(400, "This email id is already registered");
    }

    let user = await User.create({
        firstName,
        lastName,
        email,
        password,
    });

    user = user.toObject();
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;

    if (!user) {
        throw new ApiError(500, "Problem in registering user");
    }

    return res.status(201).json(new ApiResponse(201, user, "User Registered"));
});

const loginUser = asynHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field.trim() == "")) {
        throw new ApiError(400, "Please provide Email and Password");
    }

    //find user
    let user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "User is not found with this emailId");
    }

    //check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Password is wrong");
    }

    //request for new accessToken
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    user = user.toObject();
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    delete user.password;

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asynHandler(async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out"));
});

const getCurrentUser = asynHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user is fetched"));
});

const refreshAccessToken = asynHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    const decodeToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findOne({ _id: decodeToken?._id });

    if (!user) {
        throw new ApiError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken },
                "access token refreshed"
            )
        );
});

const changeCurrentPassword = asynHandler(async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword) {
        throw new ApiError(400, "Please provide new Password");
    }

    const updateUser = await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
            $set: { password: newPassword },
        },
        {
            new: true,
        }
    ).select("-refreshToken -__v -createdAt -updatedAt -password");

    console.log(updateUser);

    return res
        .status(200)
        .json(new ApiResponse(200, updateUser, "Password has been updated"));
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    refreshAccessToken,
    getCurrentUser,
};
