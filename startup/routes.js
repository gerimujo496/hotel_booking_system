require("express-async-errors");
const express = require("express");
const signup = require("../routes/signup");
const login = require("../routes/login");
const user = require("../routes/user");

module.exports = function (app) {
  app.use(express.json());
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/user", user);
};
