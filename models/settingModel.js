const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  minBookingLength: {
    type: Number,
    required: ["minBookingLength is required"],
  },
  maxBookingLength: {
    type: Number,
    required: ["maxBookingLength is required"],
  },
  breakFastPrice: {
    type: Number,
    required: ["breakFastPrice is required"],
  },
  maxGuestsPerBooking: {
    type: Number,
    required: ["maxGuestsPerBooking is required"],
  },
});

module.exports = mongoose.model("Setting", settingSchema);
