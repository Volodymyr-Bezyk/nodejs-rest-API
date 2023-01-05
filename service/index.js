const Contact = require("./schemas/contact");

const getAllContacts = async () => Contact.find();

const getContactById = async (id) => Contact.findOne({ _id: id });

const addContact = async (fields) => Contact.create(fields);

const deleteContact = async (id) => Contact.findByIdAndRemove({ _id: id });

const replaceContact = async (id, fields) =>
  Contact.findOneAndReplace({ _id: id }, fields);

const updateStatusContact = async (id, fields) =>
  Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateStatusContact,
  deleteContact,
  replaceContact,
};
