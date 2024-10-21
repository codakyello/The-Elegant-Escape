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
  const apiFeatures = new APIFEATURES(Guest, req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const guests = await apiFeatures.query;

  const totalGuests = await Guest.countDocuments();

  sendSuccessResponseData(res, "guests", guests, totalGuests);
});

module.exports.getMyBookings = catchAsync(async function (req, res) {
  const apiFeatures = new APIFEATURES(
    Booking.find({ guest: req.user.id }),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();

  const bookings = await apiFeatures.query;
  const totalBookings = bookings.length;

  sendSuccessResponseData(res, "bookings", bookings, totalBookings);
});

module.exports.getGuestBookings = catchAsync(async function (req, res) {
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

module.exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user Posts password data
  if (req.body.password || req.body.passwordConfirm)
    throw new AppError(
      "This route is not for password updates. Please use /updateMyPassword",
      400
    );

  // 2) We want to update the email and name
  const filteredBody = filterObj(
    req.body,
    "nationality",
    "nationalID",
    "countryFlag"
  );

  const updatedUser = await Guest.findByIdAndUpdate(
    req.user._id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  sendSuccessResponseData(res, "guest", updatedUser);
});

module.exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({});
});

module.exports.getGuest = catchAsync(async function (req, res) {
  const guestId = req.params.id;
  const user = await Guest.findById(guestId);
  if (!user) throw new AppError("No user was found", 404);

  sendSuccessResponseData(res, "guest", user);
});

module.exports.getGuestByEmail = catchAsync(async function (req, res) {
  const email = req.query.email;
  const user = await Guest.findOne({ email });
  console.log(user);
  if (!user) throw new AppError("No user was found", 404);

  sendSuccessResponseData(res, "guest", user);
});

module.exports.Me = catchAsync(async function (req, res) {
  const user = await Guest.findById(req.user.id);
  if (!user) throw new AppError("No user was found", 404);

  sendSuccessResponseData(res, "guest", user);
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
