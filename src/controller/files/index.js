const { findUser } = require("../../service/auth");

const uploadUserAvatarController = async (req, res, next) => {
  const user = await findUser(req.owner._id);
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  user.avatarURL = `${req.protocol}://${req.get("host")}/avatars/${
    req.owner.img
  }`;
  await user.save();

  return res.status(200).json({ avatarURL: user.avatarURL });
};

module.exports = { uploadUserAvatarController };
