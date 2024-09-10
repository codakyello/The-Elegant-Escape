const Booking = require("../models/bookingModel");
const Guest = require("../models/guestModel");
const APIFEATURES = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendSuccessResponseData } = require("../utils/responseHelpers");

const filterObj = function (obj, ...allowedFields) {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

module.exports.getAllGuest = catchAsync(async function (req, res) {
  const guests = await Guest.find();
  sendSuccessResponseData(res, "guests", guests);
});

module.exports.getMyBookings = catchAsync(async function (req, res) {
  const apiFeatures = new APIFEATURES(
    Booking.find({ guest: req.user.id }).populate("cabin"),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const bookings = await apiFeatures.query;

  sendSuccessResponseData(res, "bookings", bookings);
});

module.exports.getGuestBookings = catchAsync(async function (req, res) {
  // route only for admin
  const apiFeatures = new APIFEATURES(
    Booking.find({ guest: req.params.guestId }),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const bookings = await apiFeatures.query;

  sendSuccessResponseData(res, "bookings", bookings);
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user Posts password data
  if (req.body.password || req.body.passwordConfirm)
    throw new AppError(
      "This route is not for password updates. Please use /updateMyPassword",
      400
    );

  // 2) We want to update the email and name
  const filteredBody = filterObj(req.body, "email", "fullName");

  const updatedUser = await Guest.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});

module.exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({});
});

module.exports.getGuest = catchAsync(async function (req, res) {
  const guestId = req.params.id;
  const user = await Guest.find({ guestId });
  if (!user) throw new AppError("No user was found", 404);

  return res.status(200).json({
    status: "success",
    user,
  });
});

module.exports.Me = catchAsync(async function (req, res) {
  const user = await Guest.findById(req.user.id);
  if (!user) throw new AppError("No user was found", 404);

  return res.status(200).json({
    status: "success",
    user,
  });
});

module.exports.updateGuest = catchAsync(async function (req, res) {
  return res.status(500).json({
    status: "error",
    data: "This route is not yet defined",
  });
});

module.exports.deleteGuest = catchAsync(async function (req, res) {
  return res.status(500).json({
    status: "error",
    data: "This route is not yet defined",
  });
});
