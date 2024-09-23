const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

//All routes
const { eventRouter } = require("./routes/event.route");
const userRouter = require("./routes/user.route");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/event", eventRouter);

module.exports = app;
