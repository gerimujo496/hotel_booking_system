const mongoose = require("mongoose");

module.exports = function () {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.DB)
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};
