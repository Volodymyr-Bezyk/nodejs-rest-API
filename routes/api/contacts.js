const express = require("express");
const { contactSchema } = require("../../schemas/contacts");

const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    return res.status(200).json({ contacts });
  } catch (err) {
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ contact });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    await contactSchema.validateAsync(req.body);
    const newContact = await addContact(req.body);

    return res.status(201).json(newContact);
  } catch (err) {
    if (err.isJoi) err.status = 400;
    next(err);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);

    if (!removedContact) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Contact deleted", removedContact });
  } catch (err) {
    next(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await contactSchema.validateAsync(req.body);
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(updatedContact);
  } catch (err) {
    if (err.isJoi) err.status = 400;
    next(err);
  }
});

module.exports = router;
