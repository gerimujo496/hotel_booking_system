require("express-async-errors");
const mongoose = require("mongoose");

module.exports = async(req, res, next) => {
  const arrayOfId = [];

  for (key of Object.keys(req.params)) {
    arrayOfId.push(req.params[key]);
  }
  arrayOfId.forEach((value) => {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) {
      return res.status(400).send(`Invalid id !`);
    }
  });

  next();
 
};
