const Guest = require("../models/guestModel");
module.exports.getAllGuest = function (req, res) {
  return res.status(200).json({
    status: "success",
    data: {},
  });
};

module.exports.createGuest = async function (req, res) {
  const newGuest = req.body;
  try {
    const guest = await Guest.create(newGuest);

    return res.status(200).json({
      status: "success",
      data: { guest },
    });
  } catch (e) {
    return res.status(400).json({
      status: "failed",
    });
    console.log(e);
  }
};
