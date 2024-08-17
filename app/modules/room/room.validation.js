const Joi = require("joi");

const validateRoom = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().required(),
    number: Joi.number().required(),
    description: Joi.string().min(5).max(500).required(),
    numberOfBeds: Joi.number().min(1).max(5).required(),
  });
  const result = schema.validate(req.body);

  if (result.error)
    return res.status(400).send(result.error.details[0].message);

  next();
};

module.exports.validateRoom = validateRoom;
