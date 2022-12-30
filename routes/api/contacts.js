const express = require("express");
const { contactSchema } = require("../../schemas/contacts");
const { errorHandler } = require("../../helpers/errorHandler");

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
    errorHandler(next, err, "Get request error");
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ contact });
  } catch (err) {
    errorHandler(next, err, "Get request by ID error");
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!(name && email && phone))
      return res.status(400).json({ message: "Missing required name field" });

    await contactSchema.validateAsync(req.body);
    const newContact = await addContact(req.body);

    return res.status(201).json(newContact);
  } catch (err) {
    errorHandler(next, err, "Post request error");
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);

    if (!removedContact) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ message: "Contact deleted", removedContact });
  } catch (err) {
    errorHandler(next, err, "Delete request error");
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone } = req.body;

    if (!(name && email && phone))
      return res.status(400).json({ message: "Missing fields" });

    await contactSchema.validateAsync(req.body);
    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) return res.status(404).json({ message: "Not found" });

    return res.status(200).json(updatedContact);
  } catch (err) {
    errorHandler(next, err, "Update request error");
  }
});

module.exports = router;
