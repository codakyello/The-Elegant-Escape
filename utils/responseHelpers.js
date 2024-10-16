const jwt = require("jsonwebtoken");
const Guest = require("../models/guestModel");
const { verifyJwt } = require("./jwt");

module.exports.sendSuccessResponseData = (res, dataName, data, totalCount) => {
  const responseData = {};
  responseData[dataName] = data;

  res.status(200).json({
    ...(totalCount !== undefined && totalCount !== null ? { totalCount } : {}),
    status: "success",
    results: data.length,
    data: responseData,
  });
};

module.exports.createSendToken = async (user, statusCode, res) => {
  const maxAge = process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  const decoded = await verifyJwt(token, process.env.JWT_SECRET);
  const cookieOptions = {
    maxAge,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // Latest time token was assigned, invalidates all other tokens assigned before this.
  await Guest.findByIdAndUpdate(user.id, {
    tokenAssignedAt: decoded.iat * 1000,
  });

  // Remove password from output
  user.password = undefined;
  user.tokenAssignedAt = undefined;
  user.passwordChangedAt = undefined;
  res.cookie("jwt", token, cookieOptions).status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
