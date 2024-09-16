const crypto = require("crypto");
const Guest = require("../models/guestModel");
const Admin = require("../models/adminModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const { createSendToken } = require("../utils/responseHelpers");
const { verifyJwt } = require("../utils/jwt");

module.exports.authenticate = catchAsync(async (req, res, next) => {
  let token = req.headers.authorization;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies) {
    token = req.cookies.jwt;
    console.log("cookie present");
  }

  console.log(token);

  if (!token) throw new AppError("You are not logged in!, Please log in", 401);

  // 2) Verify token
  const decoded = await verifyJwt(token, process.env.JWT_SECRET);

  // 3) Check if user still exists (admin or guest)
  const freshUser =
    (await Guest.findById(decoded.id).select("+role")) ||
    (await Admin.findById(decoded.id).select("+role"));

  if (!freshUser)
    throw new AppError(
      "The user belonging to this token does no longer exist.",
      401
    );

  //4) Check if user changed password after the token was issued
  //5) Additional security if account has been compromised.
  if (freshUser.changePasswordAfter(decoded.iat))
    throw new AppError(
      "User recently changed password! Please log in again",
      401
    );

  //6) Check if it is the latest requested token.
  if (!freshUser.checkLatestToken(decoded.iat))
    throw new AppError(
      "Login Again. You cannot be logged into more than one device at a time!",
      401
    );

  req.user = freshUser;

  next();
});

module.exports.authorize = (...roles) =>
  catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new AppError(
        "You do not have permission to perfom this action",
        401
      );

    next();
  });

// Authentication endpoint to check if a token is valid
module.exports.verifyToken = function (req, res) {
  res.status(200).json({
    status: "success",
    message: "Successfully authenticated",
  });
};

module.exports.getGuest = catchAsync(async function (req, res) {
  if (!req.body.email) throw new AppError("Please provide an email");
  const guest = await Guest.findOne({ email: req.body.email });
  if (!guest) throw new AppError("Guest has not been created");
  res.status(200).json({
    message: "success",
    data: { guest },
  });
});

module.exports.createGuest = catchAsync(async function (req, res) {
  const guest = await Guest.create(req.body.user);
  res.status(200).json({
    message: "success",
    data: { guest },
  });
});
// Google as well as other provider sign in
module.exports.guestSignIn = catchAsync(async function (req, res) {
  console.log(req.body);
  let guest;
  guest = await Guest.findOne({ email: req.body.email });
  const newGuest = {
    fullName: req.body.name,
    image: req.body.image,
    email: req.body.email,
  };
  if (!guest) guest = await Guest.create(newGuest);
  createSendToken(guest, 200, res);
});

module.exports.guestLogin = catchAsync(async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError("Please provide email or password");

  const guest = await Guest.findOne({ email }).select("+password");
  if (!guest || !(await guest.correctPassword(password, guest.password)))
    throw new AppError("Incorrect email or password");

  // Hide password fields
  guest.password = undefined;
  guest.passwordChangedAt = undefined;

  await createSendToken(guest, 200, res);
});

module.exports.guestSignUp = catchAsync(async function (req, res) {
  if (await Guest.findOne({ email: req.body.email }))
    throw new AppError("Account already registered. Please log in", 409);

  const newGuest = await Guest.create(req.body);
  const guest = await Guest.findOne({ _id: newGuest._id });

  await createSendToken(guest, 201, res);
});

/***********/
//*Admins*//
/**********/

module.exports.adminSignUp = catchAsync(async function (req, res) {
  if (await Admin.findOne({ email: req.body.email }))
    throw new AppError("Account already registered. Please log in", 409);

  const newAdmin = await Admin.create(req.body);

  // Hide password field
  newAdmin.password = undefined;
  await createSendToken(newAdmin, 201, res);
});

module.exports.adminLogin = async function (req, res) {
  const { email, password } = req.body;

  //1) Check if email and password exist

  if (!email || !password)
    throw new AppError("Please provide email and password!", 400);

  //2) Check if user exists && password is correct

  let admin = await Admin.findOne({ email }).select("+password");

  console.log(admin);

  if (!admin || !(await admin.correctPassword(password, admin.password)))
    throw new AppError("Incorrect email or password", 401);

  //3) If everything ok, send token to client
  await createSendToken(admin, 200, res);
};

module.exports.forgotGuestPassword = catchAsync(async function (req, res) {
  // find the userId based on email
  const { email } = req.body;
  if (!email) throw new AppError("Please provide an email", 400);

  const guest = await Guest.findOne({ email });

  if (!guest) throw new AppError("There is no user with email", 404);

  const resetToken = guest.createPasswordResetToken();

  await guest.save({ validateBeforeSave: false });

  // if user found
  // send them a reset token.
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: guest.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    console.log(err);
    guest.passwordResetToken = undefined;
    guest.passwordResetTokenExpires = undefined;
    await guest.save();

    throw new AppError(
      "There was an error sending the email. Try again later!",
      500
    );
  }
});

module.exports.resetGuestPassword = catchAsync(async function (req, res, next) {
  const { password, confirmPassword } = req.body;

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 1) Get user based on the token
  const guest = await Guest.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!guest) throw new AppError("Token is invalid or has expired!", 400);

  guest.password = password;
  guest.confirmPassword = confirmPassword;
  guest.passwordResetToken = undefined;
  guest.passwordResetTokenExpires = undefined;
  await guest.save({ validateBeforeSave: true });

  createSendToken(guest, 200, res);
});

module.exports.updateGuestPassword = catchAsync(async function (req, res) {
  //1.) ask for previous password
  console.log(req.user);
  const guest = await Guest.findById(req.user.id).select("+password");

  const { currPassword, password, confirmPassword } = req.body;

  if (!currPassword) throw new AppError("What is your old password", 400);

  if (!(await guest.correctPassword(currPassword, guest.password))) {
    // change it to the new Password
    throw new AppError("Password is incorrect", 401);
  }
  if (await guest.correctPassword(password, guest.password)) {
    throw new AppError("New password cannot be the same as old password", 400);
  }
  guest.password = password;
  guest.confirmPassword = confirmPassword;
  await guest.save({ validateBeforeSave: true });

  createSendToken(guest, 200, res);
});

// Automatically call this function
module.exports.refreshToken = catchAsync(async function (req, res) {
  const guest = await Guest.findById(req.user.id);
  createSendToken(guest, 200, res);
});
