const validateToken = require("./validateToken");

module.exports = (req, res, next) => {

  const user = useContext(req, res);
  req.user = user;
  
  if (user.isManager) next();
};
