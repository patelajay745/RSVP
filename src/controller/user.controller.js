// const {}=require()
const { User } = require("../models/user.model");
const { Verify } = require("../models/verify.model");
const { asynHandler } = require("../utils/asyncHandler");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
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

const SES = new AWS.SES();

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

    //verification process
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const verify = await Verify.create({
        user: user._id,
        code,
        expiry: Date.now() + 3600000,
    });

    const data = `Hi ${firstName},

Thank you for registering! Before we finalize your RSVP, please confirm your email address by entering the verification code below:

Your Confirmation Code:
${code}

Please enter this code in the app/website to verify your email.`;

    const params = {
        Destination: {
            // ToAddresses: ["virangipatel2891@gmail.com"],
            ToAddresses: email,
        },
        Message: {
            Body: {
                Text: {
                    Data: data,
                },
            },
            Subject: { Data: "RSVP Confirmation Code" },
        },
        Source: "patel.ajay745@gmail.com",
    };

    const response = await SES.sendEmail(params).promise();

    console.log(response);

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

    const user = await User.findById(req.user?._id);
    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password has been updated"));
});

const verifyEmail = asynHandler(async (req, res) => {
    //deconstruct userId and code
    //find latest entry using userId from verify collection
    // check if it is expired or not, if expired then tell them to request new one
    // check code is right if not then send error
    // if it is right then update user table and send 200 code as response.
    const { code } = req.body;
    const userId = req.user._id;
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    refreshAccessToken,
    getCurrentUser,
    verifyEmail,
};
