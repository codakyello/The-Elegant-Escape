const Setting = require("../models/settingModel");
const catchAsync = require("../utils/catchAsync");
const { sendSuccessResponseData } = require("../utils/responseHelpers");

module.exports.getSettings = catchAsync(async (req, res) => {
  const setting = await Setting.findOne({});

  sendSuccessResponseData(res, "settings", setting);
});

module.exports.createSettings = catchAsync(async (req, res) => {
  const newSetting = await Setting.create(req.body);

  sendSuccessResponseData(res, "settings", newSetting);
});

module.exports.updateSettings = catchAsync(async (req, res) => {
  const setting = await Setting.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
  });

  module.exports.deleteSettings = catchAsync(async (req, res) => {
    await Setting.findOneAndDelete({});
    res.status(204).json();
  });
});
