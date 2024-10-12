const mongoose = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "An Please provide your email"],
    unique: true,
    lower: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: { type: String, default: "admin" },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: [
      function (el) {
        return el === this.password;
      },
      "Passwords do not match",
    ],
  },
  isRoot: {
    type: Boolean,
    default: false,
  },
  active: { type: Boolean, default: true, select: false },
  passwordChangedAt: Date,
  image: String,
  passwordChangedAt: Date,
});

// adminSchema.pre('save', async function)
adminSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

adminSchema.pre("save", async function (next) {
  // hash password
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

adminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }

  return false;
};

module.exports = mongoose.model("Admin", adminSchema);
