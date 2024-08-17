const { createToken } = require("../../config/authentication/jwt");
const errors = require("../../constants/errors");
const { User } = require("../../models/user");

const registerUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send({ message: errors.USER_ALREADY_REGISTERED });
  }

  const newUser = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "password"])
  );
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  await newUser.save();
  res.sendStatus(204);
};

const loginUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send(errors.INVALID_CREDENTIALS);
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(400).send(errors.INVALID_CREDENTIALS);
  }

  const token = createToken(user);
  res.status(200).send(token);
};

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
