const jwt = require("jsonwebtoken");

const createToken = (user) =>
  jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isManager: user.isManager,
    },

    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "10h" }
  );

const verifyToken = (token, done) => {
  const decoded = jwt.decode(token, process.env.JWT_PRIVATE_KEY);
  if (
    decoded?._id &&
    decoded?.firstName &&
    decoded?.lastName &&
    decoded?.email &&
    decoded?.isManager !== undefined
  ) {
    done(null, token);
  } else {
    done(null, false);
  }
};

module.exports.createToken = createToken;
module.exports.verifyToken = verifyToken;
