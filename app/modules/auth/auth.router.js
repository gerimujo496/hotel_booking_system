import { registerUser, loginUser } from "./auth.controller";
import { registerUserValidator, loginUserValidator } from "./auth.validator";

const express = require("express");
const router = express.Router();
const BASE_ROUTE = "/auth";

 const routes = {
  REGISTRATION: `${BASE_ROUTE}/registration`,
  LOG_IN: `${BASE_ROUTE}/login`,
};

router.route(routes.REGISTRATION).post(registerUserValidator, registerUser);
router.route(routes.LOG_IN).post(loginUserValidator, loginUser);
 
module.exports.auth = router; 