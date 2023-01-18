const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../tmp"));
  },
  filename: function (req, file, cb) {
    const { originalname } = file;
    cb(null, originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const upload = multer({ storage });

module.exports = { upload };
