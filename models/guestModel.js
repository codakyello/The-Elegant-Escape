const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const guestSchema = mongoose.Schema({
  created_at: { type: Date, default: Date.now(), select: false },
  fullName: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    unique: true,
    lower: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    required: [true, "Please tell us your email"],
  },
  role: { type: String, default: "guest" },
  password: {
    type: String,
    minLength: 8,
    select: false,
  },
  image: {
    type: String,
  },
  confirmPassword: {
    type: String,
    validate: [
      function (el) {
        console.log(el);
        console.log(this.password);
        return el === this.password;
      },
      "Passwords do not match",
    ],
  },
  nationality: {
    type: String,
  },
  nationalID: Number,
  countryFlag: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  tokenAssignedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

guestSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

guestSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
});

guestSchema.pre("save", async function (next) {
  // hash password
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

guestSchema.methods.checkLatestToken = function (JWT_TIMESTAMP) {
  const tokenAssignedAtTimeStamp = parseInt(
    this.tokenAssignedAt.getTime() / 1000,
    10
  );

  return tokenAssignedAtTimeStamp == JWT_TIMESTAMP;
};

guestSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

guestSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }

  return false;
};

guestSchema.methods.createPasswordResetToken = function () {
  // create a random token
  const resetToken = crypto.randomBytes(32 / 2).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
  // length / 2 because each byte is 2 hex characters
};

const Guest = mongoose.model("Guest", guestSchema);
module.exports = Guest;
