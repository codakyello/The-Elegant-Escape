const Setting = require("../models/settingModel");
const catchAsync = require("../utils/catchAsync");
const { sendSuccessResponseData } = require("../utils/responseHelpers");

module.exports.getSettings = catchAsync(async (req, res) => {
  const setting = await Setting.findOne({});

  sendSuccessResponseData(res, "setting", setting);
});

module.exports.createSettings = catchAsync(async (req, res) => {
  const newSetting = await Setting.create(req.body);

  sendSuccessResponseData(res, "setting", newSetting);
});

module.exports.updateSettings = catchAsync(async (req, res) => {
  const setting = await Setting.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
  });

  sendSuccessResponseData(res, "setting", setting);
});
