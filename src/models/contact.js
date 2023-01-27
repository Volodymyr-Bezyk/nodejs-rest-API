const { Schema, model } = require("mongoose");

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = model("contact", contact);
module.exports = Contact;
