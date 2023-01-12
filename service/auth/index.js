const User = require("../schemas/user");

const registerUser = async (fields) => await User.create(fields);

const loginUser = async (email) => await User.findOne({ email });

const findUser = async (userId) => await User.findById({ _id: userId });

const updateUserStatus = async (id, statusFields) =>
  await User.findOneAndUpdate({ _id: id }, statusFields, {
    new: true,
    runValidators: true,
  });

module.exports = {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
};
