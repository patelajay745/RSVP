const serverless = require("serverless-http");
const express = require("express");
const app = require("./app");

const { connectDB } = require("./db/");

connectDB()
    .then(() => {})
    .catch();

module.exports.handler = serverless(app);
