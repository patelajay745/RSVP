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
const { eventRouter } = require("./routes/event.routes");

app.use("/api/v1/event", eventRouter);

// app.get("/", (req, res, next) => {
//     return res.status(200).json({
//         message: "Hello from root!",
//     });
// });

// app.get("/path", (req, res, next) => {
//     return res.status(200).json({
//         message: "Hello from path!",
//     });
// });

// app.use((req, res, next) => {
//     return res.status(404).json({
//         error: "Not Found",
//     });
// });

module.exports = app;
