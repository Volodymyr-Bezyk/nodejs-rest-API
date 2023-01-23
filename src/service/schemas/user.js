const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { boolean } = require("joi");

const user = new Schema(
  {
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: String,
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

user.methods.userData = function () {
  return {
    email: this.email,
    subscription: this.subscription,
  };
};
user.pre("save", async function (next) {
  try {
    if (!this.isNew) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    next(error);
  }
});

const User = model("user", user);

module.exports = User;
