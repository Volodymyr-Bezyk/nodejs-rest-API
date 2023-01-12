const Contact = require("../schemas/contact");

const getContacts = async (owner, skip, pageLimit, favorite) =>
  await Contact.find({
    owner,
    $or: [{ favorite: favorite ?? true }, { favorite: favorite ?? false }],
  })
    .skip(skip)
    .limit(pageLimit)
    .catch((e) => e);

const getContactById = async (id, owner) =>
  await Contact.findOne({ _id: id, owner }).catch((e) => e);

const addContact = async (fields, owner) =>
  await Contact.create({ ...fields, owner }).catch((e) => e);

const deleteContact = async (id, owner) =>
  await Contact.findOneAndRemove({ _id: id, owner }).catch((e) => e);

const replaceContact = async (id, owner, fields) =>
  await Contact.findOneAndReplace(
    { _id: id, owner },
    { ...fields, owner }
  ).catch((e) => e);

const updateStatusContact = async (id, owner, fields) =>
  await Contact.findOneAndUpdate({ _id: id, owner }, fields, {
    new: true,
    runValidators: true,
  }).catch((e) => e);

module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  replaceContact,
  updateStatusContact,
};
