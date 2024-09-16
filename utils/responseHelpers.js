const jwt = require("jsonwebtoken");
const Guest = require("../models/guestModel");
const { signToken, verifyJwt } = require("./jwt");

module.exports.sendSuccessResponseData = (res, dataName, data) => {
  const responseData = {};
  responseData[dataName] = data;

  res.status(200).json({
    status: "success",
    results: data.length,
    data: responseData,
  });
};

function parseTimeString(timeString) {
  const time = parseInt(timeString);
  const unit = timeString.slice(-1);
  console.log(unit);

  if (unit === "m") {
    return time * 60 * 1000; // minutes to milliseconds
  }
  if (unit === "hr") {
    return time * 60 * 60 * 1000;
  }
  if (unit === "d") {
    return time * 24 * 60 * 60 * 1000;
  }
  // Add more cases for other units like hours ('h'), etc., if needed
  throw new Error("Unsupported time unit");
}

module.exports.createSendToken = async (user, statusCode, res) => {
  const maxAge = parseTimeString(process.env.COOKIE_EXPIRES_IN);
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const decoded = await verifyJwt(token, process.env.JWT_SECRET);
  const cookieOptions = {
    maxAge,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Latest time token was assigned, invalidates all other tokens assigned before this.
  await Guest.findByIdAndUpdate(user.id, {
    tokenAssignedAt: decoded.iat * 1000,
  });

  // Remove password from output
  user.password = undefined;
  user.tokenAssignedAt = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
