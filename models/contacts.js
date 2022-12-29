const fs = require("node:fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "./contacts.json");

async function readDataFromDB() {
  try {
    const db = await fs.readFile(contactsPath);
    return JSON.parse(db);
  } catch (err) {
    err.info = "Database read error";
    return err;
  }
}

async function writeDataToDB(data) {
  try {
    const contactsRow = JSON.stringify(data);
    await fs.writeFile(contactsPath, contactsRow);
  } catch (err) {
    throw new Error({ message: err.message, info: "Database write error" });
  }
}

const listContacts = async () => {
  try {
    const contacts = await readDataFromDB();
    return contacts;
  } catch (err) {
    err.info = "Get all contacts reques failed";
    return err;
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await readDataFromDB();
    const askedContact = contacts.find(
      (c) => c.id.toString() === contactId.toString()
    );
    return askedContact;
  } catch (err) {
    err.info = "Get contact by ID request failed";
    return err;
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await readDataFromDB();
    let removedContact = null;
    const updatedContacts = contacts.filter((contact) => {
      if (contact.id.toString() === contactId.toString()) {
        removedContact = contact;
      }
      return contact.id.toString() !== contactId.toString();
    });

    await writeDataToDB(updatedContacts);
    return removedContact;
  } catch (err) {
    err.info = "Delete contact request failed";
    return err;
  }
};

const addContact = async (body) => {
  try {
    const newContactId = nanoid();
    const newContact = { id: newContactId, ...body };
    const contacts = await readDataFromDB();
    contacts.push(newContact);
    await writeDataToDB(contacts);
    return newContact;
  } catch (err) {
    err.info = "Add contact request failed";
    return err;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await readDataFromDB();
    let askedContact = null;

    const updatedContacts = contacts.map((contact) => {
      if (contact.id.toString() === contactId.toString()) {
        askedContact = { id: contactId, ...body };
        return askedContact;
      }
      return contact;
    });
    await writeDataToDB(updatedContacts);

    return askedContact;
  } catch (err) {
    err.info = "Update contact request failed";
    return err;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
