const User = require("../schemas/user");

const registerUser = async (fields) => await User.create(fields);
const loginUser = async (email) => await User.findOne({ email });
const findUser = async (_id) => await User.findById({ _id });
const updateUserStatus = async (id, statusField) =>
  await User.findOneAndUpdate({ _id: id }, statusField, {
    new: true,
    runValidators: true,
  });

module.exports = {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
};
