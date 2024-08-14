
require("express-async-errors");
const rooms = require('../routes/room/room');
const express = require("express");
const signup = require("../routes/signup/signup");
const login = require("../routes/login");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/room",rooms);
  app.use("/api/signup", signup);
  app.use("/api/login", login);
};
