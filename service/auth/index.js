const User = require("../schemas/user");

const registerUser = async (fields) => await User.create(fields);

const loginUser = async (email, options) =>
  await User.findOne({ email }, options);

module.exports = {
  registerUser,
  loginUser,
};
