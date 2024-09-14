const express = require("express");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const adminRoutes = require("./routes/adminRoutes");
const guestRoutes = require("./routes/guestRoutes");
const cabinRoutes = require("./routes/cabinRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const settingRoutes = require("./routes/settingRoutes");

const app = express();

app.use(cors());

app.use(helmet());

app.use(cookieParser());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour! ",
});

app.use("/api", limiter);

app.use(bodyParser.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(xss());

app.use(
  hpp({
    whitelist: [],
  })
);
app.use(express.static(`${__dirname}/public`));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/v1/cabins", cabinRoutes);

app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/admins", adminRoutes);

app.use("/api/v1/guests", guestRoutes);

app.use("/api/v1/settings", settingRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Deployment Check</h1>");
});

app.use("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  // res.status(404).json({
  //   message: "No Route",
  // });
});

app.use(globalErrorHandler);
module.exports = app;
