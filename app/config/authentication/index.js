const Passport = require("passport");

const { Jwt } = require("./jwt");
const BasicAuth = "./basic";

 const jwtAuth = () => {
  Passport.use(Jwt);
};

module.exports.jwtAuth = jwtAuth;
module.exports.basicAuth = BasicAuth;
