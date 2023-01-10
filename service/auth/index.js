const User = require("../schemas/user");

const registerUser = async (fields) => await User.create(fields);

const loginUser = async (email) => await User.findOne({ email });

module.exports = {
  registerUser,
  loginUser,
};
