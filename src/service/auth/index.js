const User = require("../schemas/user");

const registerUser = async (fields) => {
  try {
    return await User.create(fields);
  } catch (error) {}
};

const loginUser = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {}
};

const findUser = async (_id) => {
  try {
    return await User.findById({ _id });
  } catch (error) {}
};

const updateUserStatus = async (id, statusField) => {
  try {
    return await User.findOneAndUpdate({ _id: id }, statusField, {
      new: true,
      runValidators: true,
    });
  } catch (error) {}
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
};
