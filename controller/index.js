const {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactController,
  replaceContactController,
  updateStatusContactController,
} = require("../service/index");

const getContacts = async (_, res, next) => {
  const contacts = await getContactsController();
  return res.status(200).json({ contacts });
};

const getContactById = async (req, res, next) => {
  const contact = await getContactByIdController(req.params.id);
  if (!contact)
    return res.status(404).json({
      message: `Not found id: ${req.params.id}`,
    });

  return res.status(200).json({ contact });
};

const addContact = async (req, res, next) => {
  const contact = await addContactController(req.body);

  return res.status(201).json({ contact });
};

const deleteContact = async (req, res, next) => {
  const contact = await deleteContactController(req.params.id);
  if (!contact)
    return res.status(404).json({ message: `Not found id: ${req.params.id}` });

  return res
    .status(200)
    .json({ message: "Contact deleted", deletedContact: contact });
};

const replaceContact = async (req, res, next) => {
  const contact = await replaceContactController(req.params.id, req.body);

  if (!contact) return res.status(404).json({ " message ": " Not found " });
  return res
    .status(200)
    .json({ message: "contact replaced", replacedContact: contact });
};

const updateContact = async (req, res, next) => {
  const contact = await updateStatusContactController(req.params.id, req.body);

  if (!contact) return res.status(404).json({ " message ": " Not found " });
  return res
    .status(200)
    .json({ message: "contact updated", updatedContact: contact });
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  replaceContact,
};
