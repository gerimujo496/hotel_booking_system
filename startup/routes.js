require("express-async-errors");
const express = require("express");
const rooms = require("../routes/room/room");
const signup = require("../routes/signup/signup");
const login = require("../routes/login");
const booking = require("../routes/booking");
const bookingHistory = require("../routes/manager/bookingHistory");
const bookingApprove = require("../routes/manager/bookingApprove");

module.exports = function (app) {
  app.use(express.json());
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/room", rooms);
  app.use("/booking", booking);
  app.use("/bookingHistory", bookingHistory);
  app.use("/bookingApprove", bookingApprove);
};
