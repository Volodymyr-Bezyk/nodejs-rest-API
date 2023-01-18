const express = require("express");
const router = express.Router();
const { upload } = require("../../middlewares/uploadFilesStore");
const { checkJwt } = require("../../middlewares/checkJWT");
const { resizeImg } = require("../../middlewares/resizeImg");
const path = require("path");
const filesPath = path.join(__dirname, "../../../public/avatars");
const { uploadUserAvatarController } = require("../../controller/files");
const { tryCatchWrap } = require("../../helpers");

router.use("/avatars", express.static(filesPath));
router.use(checkJwt);

router.patch(
  "/users/avatars",
  upload.single("avatar"),
  tryCatchWrap(resizeImg),
  tryCatchWrap(uploadUserAvatarController)
);

module.exports = router;
