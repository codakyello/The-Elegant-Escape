const Booking = require("../models/bookingModel");
const Cabin = require("../models/cabinModel");
const APIFEATURES = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendSuccessResponseData } = require("../utils/responseHelpers");

module.exports.getAllBooking = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(Booking, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const bookings = await apiFeatures.query.find().populate("guest");
  // const totalBookings = await Booking.countDocuments();

  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});

module.exports.getGuestBookings = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(Booking, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const bookings = await apiFeatures.query;

  // const totalBookings = await Booking.countDocuments();

  sendSuccessResponseData(res, "bookings", bookings);
});

module.exports.createBooking = catchAsync(async (req, res) => {
  let guestId = req.user.id;
  let newBooking = req.body;
  const cabinId = newBooking.cabinId;

  if (req.user.role === "admin") {
    // make sure a userId has been specified
    if (!newBooking.guestId) {
      throw new AppError("Admins must specify guestId for booking");
    }

    guestId = newBooking.guestId;
  }

  if (req.user.role === "guest") {
    newBooking.guest = guestId;
  }

  const cabin = await Cabin.findById(cabinId);

  if (!cabin) throw new AppError("Cabin does not exist", 404);

  if (cabin.isOccupied)
    throw new AppError(`Cannot book ${cabin.name}. Cabin is occupied`, 409);

  console.log(newBooking);
  newBooking.cabinId = undefined;
  newBooking.guestId = undefined;

  const booking = await Booking.create({
    ...newBooking,
    cabin: cabinId,
    guest: guestId,
  });

  res.status(200).json({
    message: "success",
    data: { booking },
  });
});

module.exports.getBooking = catchAsync(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) throw new AppError("Booking not Found", 404);

  res.status(200).json({
    status: "success",
    data: { booking },
  });
});

module.exports.updateBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.id;

  if (req.body.hasOwnProperty("cabinId")) {
    const cabinId = req.body.cabinId;

    const cabin = await Cabin.findById(cabinId);

    if (cabin.isOccupied)
      throw new AppError(
        `Cannot update cabin to ${cabin.name}. Cabin is occupied`,
        409
      );
  }

  const booking = await Booking.findById(bookingId);
  // const booking = await Booking.findOneAndUpdate({ _id: bookingId }, req.body, {
  //   new: true,
  //   runValidators: true,
  // });
  for (let key in req.body) {
    booking[key] = req.body[key];
  }

  // Save the updated booking document
  await booking.save();

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  console.log("update Booking");
  res.status(200).json({
    status: "success",
    data: { booking },
  });
});

module.exports.deleteBooking = catchAsync(async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.status(204).json();
});
