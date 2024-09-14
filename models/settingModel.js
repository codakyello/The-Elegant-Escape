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
});

module.exports = mongoose.model("Setting", settingSchema);
