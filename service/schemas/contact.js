const { Schema, model } = require("mongoose");

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
      unique: true,
      index: 1,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", contact);
module.exports = Contact;
