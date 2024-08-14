const useContext = require("./useContext");

module.exports = async(req, res, next) => {
  const user = await useContext(req, res);
  req.user = user;

  if (user.isManager) next();
  return res.status(400).send(`Invalid request !`);
};
