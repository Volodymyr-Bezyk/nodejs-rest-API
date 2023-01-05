const Contact = require("./schemas/contact");

const getContactsController = async () => Contact.find();

const getContactByIdController = async (id) => Contact.findOne({ _id: id });

const addContactController = async (fields) => Contact.create(fields);

const deleteContactController = async (id) =>
  Contact.findByIdAndRemove({ _id: id });

const replaceContactController = async (id, fields) =>
  Contact.findOneAndReplace({ _id: id }, fields);

const updateStatusContactController = async (id, fields) =>
  Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  deleteContactController,
  replaceContactController,
  updateStatusContactController,
};
