const express = require("express");
const router = express.Router();
const ctrlContacts = require("../controller");
const { validateBody } = require("../middlewares/validateBody");
const { contactSchema } = require("../service/schemas/contactsJoi");
const { tryCatchWrap } = require("../helpers");

router.get("/contacts", tryCatchWrap(ctrlContacts.getContacts));
router.get("/contacts/:id", tryCatchWrap(ctrlContacts.getContactById));
router.post(
  "/contacts",
  validateBody(contactSchema),
  tryCatchWrap(ctrlContacts.addContact)
);
router.delete("/contacts/:id", tryCatchWrap(ctrlContacts.deleteContact));
router.put(
  "/contacts/:id",
  validateBody(contactSchema),
  tryCatchWrap(ctrlContacts.replaceContact)
);
router.patch(
  "/contacts/:id/favorite",
  validateBody(contactSchema),
  tryCatchWrap(ctrlContacts.updateContact)
);
module.exports = router;
