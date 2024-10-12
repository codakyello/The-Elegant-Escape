const catchAsync = require("../utils/catchAsync");
const Admins = require("../models/adminModel");
const { sendSuccessResponseData } = require("../utils/responseHelpers");
const AppError = require("../utils/appError");

module.exports.isRootAdmin = (req, res, next) => {
  if (req.user.isRoot) {
    return next();
  }
  throw new AppError("You do not have permission to perform this action", 403);
};
const filterObj = function (obj, ...allowedFields) {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

module.exports.getAllAdmins = catchAsync(async function (req, res) {
  const admins = await Admins.find({});
  sendSuccessResponseData(res, "admins", admins);
});

module.exports.getAdmin = catchAsync(async function (req, res) {
  const adminId = req.params.id;
  const admin = await Admins.findById(adminId);
  if (!admin) throw new AppError("Admin does not exist!", 404);

  sendSuccessResponseData(res, "admin", admin);
});

module.exports.updateMe = catchAsync(async function (req, res) {
  // update admin profile and not his password
  if (req.body.passwordConfirm || req.body.password)
    throw new AppError(
      "You cannot update password with this route. Use /updateMyPassword"
    );

  const filteredBody = filterObj(req.body, "name", "image", "isRoot");

  const { isRoot } = req.body;

  if (isRoot && !req.user.isRoot)
    throw new AppError("You do not have permission to create a root user", 403);

  const admin = await Admins.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  sendSuccessResponseData(res, "admin", admin);
});

module.exports.deleteAdmin = catchAsync(async function (req, res) {
  // check if admin is root admin

  const id = req.params.adminId;

  if (!id) throw new AppError("No Admin was specified", 400);

  const admin = await Admins.findByIdAndUpdate(id, { active: false });

  if (!admin) throw new AppError("No Admin found with that ID", 404);

  sendSuccessResponseData(
    res,
    "message",
    "Admin has been deactivated successfully"
  );
});
