const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  replaceContact,
} = require("../controller");

const { validateBody } = require("../middlewares/validateBody");
const {
  contactSchema,
  updateContactSchema,
} = require("../service/schemas/contactsJoi");
const { tryCatchWrap } = require("../helpers");

router.get("/contacts", tryCatchWrap(getContacts));
router.get("/contacts/:id", tryCatchWrap(getContactById));
router.post("/contacts", validateBody(contactSchema), tryCatchWrap(addContact));
router.delete("/contacts/:id", tryCatchWrap(deleteContact));
router.put(
  "/contacts/:id",
  validateBody(contactSchema),
  tryCatchWrap(replaceContact)
);
router.patch(
  "/contacts/:id/favorite",
  validateBody(updateContactSchema),
  tryCatchWrap(updateContact)
);
module.exports = router;
