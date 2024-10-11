const querystring = require("querystring");
const { ApiResponse } = require("../../utils/ApiResponse");
const { User } = require("../../models/user.model");
const connectDb = require("../../db");

connectDb(process.env.MONGODB_URI);

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiResponse(
            500,
            "Something went wrong while generating tokens"
        );
    }
};

module.exports.handler = async (event) => {
    const parsedBody = querystring.parse(event.body);
    const { email, password } = parsedBody;

    if ([email, password].some((field) => (field || "").trim() == "")) {
        return new ApiResponse(400, "Please provide Email and Password");
    }

    //find user
    let user = await User.findOne({ email });
    if (!user) {
        return new ApiResponse(400, "User is not found with this emailId");
    }
    console.log(user);

    //check password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return new ApiResponse(400, "Password is wrong");
    }

    //request for new accessToken
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

    user = user.toObject();
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    delete user.password;

    return new ApiResponse(
        200,
        "User logged in successfully",
        {
            user,
            accessToken,
            refreshToken,
        },
        {
            Location: "/",
            "Set-Cookie": `accessToken=${accessToken}; Secure; HttpOnly; SameSite=Lax; Path=/`,
            "Set-Cookie": `refreshToken=${refreshToken}; Secure; HttpOnly; SameSite=Lax; Path=/`,
        }
    );
};
