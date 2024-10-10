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
  console.log("here");
  const setting = await Setting.findOneAndUpdate({}, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  sendSuccessResponseData(res, "settings", setting);
});
