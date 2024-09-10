const mongoose = require("mongoose");
const validator = require("validator");

const cabinSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "A cabin must have a name"],
  },

  maxCapacity: Number,

  regularPrice: {
    type: Number,
    required: [true, "A cabin must have a price"],
  },

  discount: { type: Number, default: 0 },

  imageCover: {
    type: String,
    required: [true, "A cabin must have a cover image"],
  },

  images: [String],

  description: String,

  isOccupied: {
    type: Boolean,
    default: false,
  },

  cabinPrice: Number,
});

const Cabin = mongoose.model("Cabin", cabinSchema);

module.exports = Cabin;
