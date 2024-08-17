import { registerUser, loginUser } from "./auth.controller";
import { registerUserValidator, loginUserValidator } from "./auth.validator";

const { Router } = require("express");
const validator = require("");
const router = new Router();
const BASE_ROUTE = "/auth";

export const routes = {
  REGISTRATION: `${BASE_ROUTE}/registration`,
  LOG_IN: `${BASE_ROUTE}/login`,
};

router.router(routes.REGISTRATION).post(registerUserValidator, registerUser);
router.router(routes.LOG_IN).post(loginUserValidator, loginUser);
