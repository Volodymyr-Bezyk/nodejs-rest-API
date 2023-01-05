const service = require("../service/index");

const getContacts = async (_, res, next) => {
  const contacts = await service.getAllContacts();
  return res.status(200).json({ contacts });
};

const getContactById = async (req, res, next) => {
  const contact = await service.getContactById(req.params.id);
  if (contact) return res.status(200).json({ contact });

  return res.status(404).json({
    message: `Not found id: ${req.params.id}`,
  });
};

const addContact = async (req, res, next) => {
  const contact = await service.addContact(req.body);

  return res.status(201).json({ contact });
};

const deleteContact = async (req, res, next) => {
  const contact = await service.deleteContact(req.params.id);
  if (contact)
    return res
      .status(200)
      .json({ message: "Contact deleted", deletedContact: contact });

  return res.status(404).json({ message: `Not found id: ${req.params.id}` });
};

const replaceContact = async (req, res, next) => {
  const contact = await service.replaceContact(req.params.id, req.body);

  if (!contact) return res.status(404).json({ " message ": " Not found " });
  return res
    .status(200)
    .json({ message: "contact replaced", replacedContact: contact });
};

const updateContact = async (req, res, next) => {
  if (req.body.favorite === undefined)
    return res.status(400).json({ message: "missing field favorite" });

  const contact = await service.updateStatusContact(req.params.id, req.body);

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
