const express = require("express");
const router = express.Router();
const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
  replaceContactController,
} = require("../../controller/api");

const { validateBody } = require("../../middlewares/validateBody");
const {
  contactSchema,
  updateContactSchema,
  replaceContactSchema,
} = require("../../service/schemas/contactsJoi");
const { tryCatchWrap } = require("../../helpers");
const { checkJwt } = require("../../middlewares/checkJWT");

router.use(checkJwt);
router.get("/contacts", tryCatchWrap(getContactsController));
router.get("/contacts/:id", tryCatchWrap(getContactByIdController));
router.post(
  "/contacts",
  validateBody(contactSchema),
  tryCatchWrap(addContactController)
);
router.delete("/contacts/:id", tryCatchWrap(deleteContactController));
router.put(
  "/contacts/:id",
  validateBody(replaceContactSchema),
  tryCatchWrap(replaceContactController)
);
router.patch(
  "/contacts/:id/favorite",
  validateBody(updateContactSchema),
  tryCatchWrap(updateContactController)
);
module.exports = router;
