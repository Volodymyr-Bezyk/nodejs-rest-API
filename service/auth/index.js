const User = require("../schemas/user");

const registerUser = async (fields) => await User.create(fields);

const loginUser = async (email) => await User.findOne({ email });

const findUser = async (userId) => await User.findById({ _id: userId });

module.exports = {
  registerUser,
  loginUser,
  findUser,
};
