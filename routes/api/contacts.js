const express = require("express");

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
    err.info = "Get request error";
    return err;
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    return res.status(200).json({ contact });
  } catch (err) {
    err.info = "Get request by ID error";
    return err;
  }
});

router.post("/", async (req, res, next) => {
  // res.json({ message: "template message" });
  try {
    const contactCredentials = req.body;
    const newContact = await addContact(contactCredentials);

    return res.status(201).json(newContact);
  } catch (err) {
    err.info = "Post request error";
    return err;
  }
});

router.delete("/:contactId", async (req, res, next) => {
  // res.json({ message: "template message" });
  try {
    const { contactId } = req.params;
    const removedContact = await removeContact(contactId);
    res.json(
      removedContact || { error: `Contact with ID ${contactId} does not exist` }
    );
  } catch (err) {
    err.info = "Delete request error";
    return err;
  }
});

router.put("/:contactId", async (req, res, next) => {
  // res.json({ message: "template message" });
  try {
    const updateCredentials = req.body;
    const { contactId } = req.params;
    const updatedContact = await updateContact(contactId, updateCredentials);
    return res.status(201).json(updatedContact);
  } catch (err) {
    err.info = "Update request error";
    return err;
  }
});

module.exports = router;
