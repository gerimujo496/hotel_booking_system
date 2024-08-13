const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User } = require("../models/user");
const { validateUser } = require("../validation/userValidation");

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ message: "User already registered" });
  }

  const newUser = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  await newUser.save();

  const token = newUser.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(
      _.pick(newUser, ["_id", "firstName", "lastName", "email", "isManager"])
    );
});

module.exports = router;
