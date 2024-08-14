const useContext = require("./useContext");
const validateToken = require("./validateToken");

module.exports = async (req, res, next) => {
  const user = await useContext(req, res);
  req.user = user;

  next();
};
