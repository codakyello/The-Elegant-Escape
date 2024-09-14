const mongoose = require("mongoose");

// create a schema
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: { type: Date, default: Date.now() },

    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "A Review must have a tour"],
    },

    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: [true, "A Review must belong to a guest"],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// create a model
module.exports = mongoose.model("Review", reviewSchema);
