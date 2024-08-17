const BasicAuth = require("express-basic-auth");

const auth = (userName, password, challenge) =>
  BasicAuth({
    users: {
      [userName]: password,
    },
    challenge,
  });

module.exports = auth;
