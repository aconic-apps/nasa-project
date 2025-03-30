const express = require("express");
const planetsRouter = require("../routes/planets/planets.router");
const launchesRouter = require("../routes/launches/launches.router");
const { checkAuth } = require("../../utils/middlewares");

const v1Router = express.Router();

v1Router.use("/planets", checkAuth, planetsRouter);

v1Router.use("/launches", checkAuth, launchesRouter);

module.exports = v1Router;
