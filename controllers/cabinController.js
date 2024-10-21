const Cabin = require("../models/cabinModel");
const catchAsync = require("../utils/catchAsync");
const APIFEATURES = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const { sendSuccessResponseData } = require("../utils/responseHelpers");
const Booking = require("../models/bookingModel");

module.exports.getAllCabins = catchAsync(async (req, res) => {
  const apiFeatures = new APIFEATURES(Cabin, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const cabins = await apiFeatures.query;

  const totalCabins = await Cabin.countDocuments();

  sendSuccessResponseData(res, "cabins", cabins, totalCabins);
});

module.exports.getCabin = catchAsync(async (req, res) => {
  const cabinId = req.params.id;

  const cabin = await Cabin.findById(cabinId);
  if (!cabin) {
    throw new AppError("Cabin not found", 404);
  }
  res.status(200).json({
    status: "success",
    data: { cabin },
  });
});

module.exports.createCabin = catchAsync(async (req, res) => {
  const newCabin = req.body;
  const cabin = await Cabin.create(newCabin);
  res.status(200).json({
    status: "success",
    data: { cabin },
  });
});

module.exports.updateCabin = catchAsync(async (req, res) => {
  const cabinId = req.params.id;

  const cabin = await Cabin.findByIdAndUpdate(cabinId, req.body, {
    new: true,
    runValidators: true,
  });

  console.log(cabin);

  if (!cabin) {
    throw new AppError("Cabin not found", 404);
  }

  res.status(200).json({
    message: "Success",
    data: { cabin },
  });
});

module.exports.deleteCabin = catchAsync(async (req, res) => {
  const cabinId = req.params.id;
  const cabin = await Cabin.findByIdAndDelete(cabinId);

  if (!cabin) {
    throw new AppError("Cabin not found", 404);
  }

  res.status(204).json({ status: "success", data: null });
});

module.exports.getCabinBookedDates = catchAsync(async (req, res) => {
  // get bookings that status is not unconfirmed and past or checkedin,
  // status is unconfirmed but not past
  // const bookings = await Booking.find({
  //   cabin: req.params.id,
  //   status: "checked-in",
  // });

  const now = new Date(); // Current date

  const bookings = await Booking.find({
    cabin: req.params.id,
    $or: [
      {
        status: "checked-in", // Ongoing bookings with "checked-in" status
      },
      {
        $and: [
          { status: "unconfirmed" }, // Status is "unconfirmed"
          { startDate: { $gte: now } }, // Start date is in the future or ongoing
        ],
      },
    ],
  });

  sendSuccessResponseData(res, "bookings", bookings);
});
