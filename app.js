const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const bodyParser = require("body-parser");
const cabinRoutes = require("./routes/cabinRoutes");
const guestRoutes = require("./routes/guestRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const settingRoutes = require("./routes/cabinRoutes");

const app = express();

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/v1/cabins", cabinRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/admins", bookingRoutes);

app.use("/api/v1/guests", guestRoutes);

app.use("/api/v1/settings", settingRoutes);

app.use("*", (req, res, next) => {
  console.log(number);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  // res.status(404).json({
  //   message: "No Route",
  // });
});

app.use(globalErrorHandler);
module.exports = app;
// Start the server and listen for requests on a chosen port (e.g., 3000)
