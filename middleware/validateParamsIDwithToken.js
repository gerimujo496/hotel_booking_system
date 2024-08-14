require("express-async-errors");
const jwt = require("jsonwebtoken");

module.exports = (paramsNameToCompare) => {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send(`Access denied. No token provided.`);

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    const idFromParams = req.params[paramsNameToCompare];
    if (decoded._id != idFromParams)
      return res.status(403).send(`You don't have premission !`);

    next();
  };
};
