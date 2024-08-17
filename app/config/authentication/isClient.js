const context = require("../app/helpers/context");

module.exports = async (req, res, next) => {
  const user = await context(req, res);
  req.user = user;

  next();
};
