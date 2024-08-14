require("express-async-errors");

module.exports =  (validator) => {
  return async (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    next();
  };
};
