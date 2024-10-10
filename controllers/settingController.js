const Setting = require("../models/settingModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { sendSuccessResponseData } = require("../utils/responseHelpers");

module.exports.getSettings = catchAsync(async (req, res) => {
  const setting = await Setting.findOne({});
  if (!setting) {
    throw new AppError("Settings not found", 404);
  }

  sendSuccessResponseData(res, "settings", setting);
});

module.exports.createSettings = catchAsync(async (req, res) => {
  const existingSetting = await Setting.findOne({});
  if (existingSetting) throw new AppError("Settings already exist", 400);

  const newSetting = await Setting.create(req.body);
  sendSuccessResponseData(res, "settings", newSetting);
});

module.exports.updateSettings = catchAsync(async (req, res) => {
  const setting = await Setting.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
  });

  if (!setting) throw new AppError("Settings not found", 404);

  sendSuccessResponseData(res, "settings", setting);
});

module.exports.deleteSettings = catchAsync(async (req, res) => {
  const setting = await Setting.findOneAndDelete({});
  if (!setting) throw new AppError("Settings not found", 404);

  res.status(204).json();
});
