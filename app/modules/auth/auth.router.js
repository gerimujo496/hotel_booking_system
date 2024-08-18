const bodyParser = require("body-parser");
const { registerUser, loginUser } = require("./auth.controller");
const {
  registerUserValidator,
  loginUserValidator,
} = require("./auth.validator");

const express = require("express");
const router = express.Router();
const BASE_ROUTE = "/auth";

const routes = {
  REGISTRATION: `${BASE_ROUTE}/registration`,
  LOG_IN: `${BASE_ROUTE}/login`,
};

router.route(routes.REGISTRATION).post(registerUserValidator, registerUser);
router.route(routes.LOG_IN).post(loginUserValidator, loginUser);

module.exports = router;
