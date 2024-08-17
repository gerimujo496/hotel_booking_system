const Joi = require("joi");

const registerUserValidator = (req, res, next) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(5).email().required(),
    password: Joi.string().min(8).max(255).required(),
    isManager: Joi.boolean(),
  });
  const result = schema.validate(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  next();
};

const loginUserValidator = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(8).max(255).required(),
  });
  const result = schema.validate(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  next();
};

module.exports.registerUserValidator = registerUserValidator;
module.exports.loginUserValidator = loginUserValidator;
