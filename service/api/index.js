const Contact = require("../schemas/contact");

const getContacts = async (owner) => await Contact.find({ owner });

const getContactById = async (id, owner) =>
  await Contact.findOne({ _id: id, owner });

const addContact = async (fields, owner) =>
  await Contact.create({ ...fields, owner });

const deleteContact = async (id, owner) =>
  await Contact.findOneAndRemove({ _id: id, owner });

const replaceContact = async (id, owner, fields) =>
  await Contact.findOneAndReplace({ _id: id, owner }, { ...fields, owner });

const updateStatusContact = async (id, owner, fields) =>
  await Contact.findOneAndUpdate({ _id: id, owner }, fields, { new: true });

module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  replaceContact,
  updateStatusContact,
};
