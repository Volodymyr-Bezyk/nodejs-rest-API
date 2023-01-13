const {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  replaceContact,
  updateStatusContact,
} = require("../../service/api/index");

const getContactsController = async (req, res, next) => {
  const { page = 1, limit = 20, favorite } = req.query;
  const pageLimit = +limit > 20 ? 20 : +limit;
  const skip = +limit * +page - +limit;

  const contacts = await getContacts(req.owner._id, skip, pageLimit, favorite);
  return res.status(200).json({ contacts });
};

const getContactByIdController = async (req, res, next) => {
  const contact = await getContactById(req.params.id, req.owner._id);
  if (!contact) {
    return res.status(404).json({
      message: `Not found id: ${req.params.id}`,
    });
  }

  return res.status(200).json({ contact });
};

const addContactController = async (req, res, next) => {
  const contact = await addContact(req.body, req.owner._id);

  return res.status(201).json({ contact });
};

const deleteContactController = async (req, res, next) => {
  const contact = await deleteContact(req.params.id, req.owner._id);
  if (!contact) {
    return res.status(404).json({ message: `Not found id: ${req.params.id}` });
  }

  return res
    .status(200)
    .json({ message: "Contact deleted", deletedContact: contact });
};

const replaceContactController = async (req, res, next) => {
  const contact = await replaceContact(req.params.id, req.owner._id, req.body);

  if (!contact) {
    return res.status(404).json({ " message ": " Not found " });
  }
  return res
    .status(200)
    .json({ message: "contact replaced", replacedContact: contact });
};

const updateContactController = async (req, res, next) => {
  const contact = await updateStatusContact(
    req.params.id,
    req.owner._id,
    req.body
  );

  if (!contact) {
    return res.status(404).json({ " message ": " Not found " });
  }
  return res
    .status(200)
    .json({ message: "contact updated", updatedContact: contact });
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
  replaceContactController,
};
