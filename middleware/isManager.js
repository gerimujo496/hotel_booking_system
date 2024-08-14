module.exports = (req, res, next) => {
  const user = useContext(req, res);
  req.user = user;

  if (user.isManager) next();
  return res.status(400).send(`Invalid request !`);
};
