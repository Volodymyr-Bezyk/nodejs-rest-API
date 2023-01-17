const User = require("../schemas/user");

const registerUser = async (fields) => {
  return await User.create(fields);
};

const loginUser = async (email) => {
  return await User.findOne({ email });
};

const findUser = async (_id) => {
  return await User.findById({ _id });
};

const updateUserStatus = async (id, statusField) => {
  return await User.findOneAndUpdate({ _id: id }, statusField, {
    new: true,
    runValidators: true,
  });
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  updateUserStatus,
};
