const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");

const resizeImg = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image not found" });
  }

  const originalFilePath = path.join(
    __dirname,
    `../../tmp/${req.file.originalname}`
  );
  const newFilePath = path.join(__dirname, "../../public/avatars");
  const [, ext] = req.file.originalname.split(".");

  const image = await Jimp.read(originalFilePath);
  image.resize(250, 250);
  await image.writeAsync(`${newFilePath}/${req.owner._id}.${ext}`);
  req.owner.img = `${req.owner._id}.${ext}`;
  await fs.unlink(originalFilePath);
  next();
};

module.exports = { resizeImg };
