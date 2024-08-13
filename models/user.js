const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, minLength: 3, maxLength: 55, required: true },
  lastName: { type: String, minLength: 3, maxLength: 55, required: true },
  email: { type: String, minLength: 3, maxLength: 55, required: true },
  password: { type: String, minLength: 8, maxLength: 50, required: true },
  isManager: { type: Boolean, required: true },
});
const User = mongoose.model("User", userSchema);
exports.User = User;
