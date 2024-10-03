const mongoose = require("mongoose");
const Cabin = require("./cabinModel");

const bookingSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
    required: [true, "A booking must have a guestId"],
  },

  cabin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cabin",
    required: [true, "A booking must have a cabinId"],
  },

  status: {
    type: String,

    enum: {
      values: ["unconfirmed", "checked-in", "checked-out"],
      message: "status is either: unconfirmed, checked-in, checked-out",
    },

    default: "unconfirmed",
  },

  numNights: Number,

  totalPrice: Number,

  extrasPrice: Number,

  totalPrice: Number,

  observations: String,

  isPaid: {
    type: Boolean,
    default: false,
  },

  created_at: { type: Date, default: Date.now() },

  startDate: { type: Date, default: Date.now() },

  endDate: { type: Date, default: Date.now() },

  hasBreakfast: {
    type: Boolean,
    default: false,
  },

  numGuests: Number,
});

bookingSchema.pre("findOne", function (next) {
  // populate all the booking with cabin info
  this.populate("cabin");
  next();
});

bookingSchema.pre("save", async function (next) {
  const booking = this; // refers to the booking document being saved
  // boolean flag to check if new
  const cabinId = this.cabinId;

  if (!booking.isModified("status")) return next();
  console.log("Status changing");
  // target new bookings or booking status changes
  const isOccupied = booking.status === "checked-in"; // check if status is check-in

  await Cabin.findByIdAndUpdate(cabinId, { isOccupied });

  next(); // Move to the next middleware or save operation
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
