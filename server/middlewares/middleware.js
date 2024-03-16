// middleware.js
const cors = require("cors");
const express = require("express");

module.exports = (app) => {
    app.use(cors());
    app.use(express.json());
};