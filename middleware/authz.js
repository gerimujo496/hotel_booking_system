require("express-async-errors");
const jwt = require("jsonwebtoken");

module.exports =  (listOfRolesAllowed) => {
  return async (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).send(`Access denied. No token provided.`);

    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const isRoleAllowed = listOfRolesAllowed.find((role) =>
      role == decoded.isManager ? "Manager" : "Client"
    );

    if (!isRoleAllowed) {
      return res.status(403).send(`You don't have premission !`);
    }

    req.user = decoded;
    next();
  };
};
