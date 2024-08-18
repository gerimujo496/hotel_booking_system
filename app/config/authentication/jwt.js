const jwt = require("jsonwebtoken");
const { ExtractJwt, Strategy } = require("passport-jwt");

const opts = {
  secretOrKey: "hotelPrivateKey",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const createToken = (user) =>
  jwt.sign(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isManager: user.isManager,
    },

    opts.secretOrKey,
    { expiresIn: "10h" }
  );

const verify = (token, done) => {
  if (
    token?._id &&
    token?.firstName &&
    token?.lastName &&
    token?.email &&
    token?.isManager !== undefined
  ) {
    done(null, token);
  } else {
    done(null, false);
  }
};

module.exports.createToken = createToken;
module.exports.verify = verify;
module.exports.Jwt = new Strategy(opts, verify);
