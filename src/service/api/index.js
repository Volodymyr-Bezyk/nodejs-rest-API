const Contact = require("../schemas/contact");

const getContacts = async (owner, skip, pageLimit, favorite) => {
  try {
    return await Contact.find({
      owner,
      $or: [{ favorite: favorite ?? true }, { favorite: favorite ?? false }],
    })
      .skip(skip)
      .limit(pageLimit);
  } catch (error) {}
};

const getContactById = async (id, owner) => {
  try {
    return await Contact.findOne({ _id: id, owner });
  } catch (error) {}
};

const addContact = async (fields, owner) => {
  try {
    return await Contact.create({ ...fields, owner });
  } catch (error) {}
};

const deleteContact = async (id, owner) => {
  try {
    return await Contact.findOneAndRemove({ _id: id, owner });
  } catch (error) {}
};

const replaceContact = async (id, owner, fields) => {
  try {
    return await Contact.findOneAndReplace(
      { _id: id, owner },
      { ...fields, owner }
    );
  } catch (error) {}
};

const updateStatusContact = async (id, owner, fields) => {
  try {
    return await Contact.findOneAndUpdate({ _id: id, owner }, fields, {
      new: true,
      runValidators: true,
    });
  } catch (error) {}
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  deleteContact,
  replaceContact,
  updateStatusContact,
};
