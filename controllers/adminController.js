const catchAsync = require("../utils/catchAsync");

module.exports.getAllAdmins = catchAsync(function (req, res) {
  return res.status(500).json({
    status: "error",
    data: "This route is not yet defined.",
  });
});

module.exports.getAdmin = catchAsync(function (req, res) {
  return res.status(500).json({
    status: "error",
    data: "This route is not yet defined",
  });
});

module.exports.updateAdmin = catchAsync(function (req, res) {
  return res.status(500).json({
    status: "error",
    data: "This route is not yet defined",
  });
});

module.exports.deleteAdmin = catchAsync(function (req, res) {
  return res.status(500).json({
    status: "error",
    data: "This route is not yet defined",
  });
});
