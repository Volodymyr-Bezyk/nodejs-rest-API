const User = require("../../models/user");

const registerUser = async (fields) => await User.create(fields);
const loginUser = async (email) => await User.findOne({ email });
const findUser = async (_id) => await User.findById({ _id });
const updateUserStatus = async (id, statusField) =>
  await User.findOneAndUpdate({ _id: id }, statusField, {
    new: true,
    runValidators: true,
  });

const verifyUser = async (verificationToken) =>
  await User.findOneAndUpdate(
    { verificationToken },
    { verify: true },
    {
      new: true,
      runValidators: true,
    }
  );

module.exports = {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
  verifyUser,
};
