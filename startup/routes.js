const express = require("express");
const signup = require("../routes/signup");
const login = require("../routes/login");

require("express-async-errors");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/signup", signup);
  app.use("/api/login", login);
};
