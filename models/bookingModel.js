const mongoose = require("mongoose");

const generateBookingId = function (length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true, required: true },
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

bookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    this.bookingId = generateBookingId(8); // Generate an 8 character unique ID
  }
  next();
});

bookingSchema.pre(/^find/, function (next) {
  // Populate all the booking queries with cabin info and guest info
  this.populate("cabin");
  this.populate("guest");

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
