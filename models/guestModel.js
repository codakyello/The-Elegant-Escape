const mongoose = require("mongoose");

const guestSchema = mongoose.Schema({
  created_at: { type: Date, default: Date.now() },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  countryFlag: String,
});

const Guest = mongoose.model("guests", guestSchema);
module.exports = Guest;
