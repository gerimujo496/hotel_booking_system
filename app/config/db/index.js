const mongoose = require("mongoose");

module.exports = function () {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://localhost/hotel")
      .then(() => resolve())
      .catch((err) => reject(err));
  });
};
