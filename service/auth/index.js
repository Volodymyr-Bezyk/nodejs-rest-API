const User = require("../schemas/user");

const registerUser = async (fields) =>
  await User.create(fields).catch((e) => e);

const loginUser = async (email) =>
  await User.findOne({ email }).catch((e) => e);

const findUser = async (_id) => await User.findById({ _id }).catch((e) => e);

const updateUserStatus = async (id, statusFields) =>
  await User.findOneAndUpdate({ _id: id }, statusFields, {
    new: true,
    runValidators: true,
  }).catch((e) => e);

module.exports = {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
};
