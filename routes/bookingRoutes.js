const router = require("express").Router();
const authController = require("../controllers/authController");
const getBookingsAfterDate = require("../controllers/bookingController");

const bookingController = require("../controllers/bookingController");

router
  .route("/")
  .get(
    authController.authenticate,
    authController.authorize("admin"),
    bookingController.getAllBooking
  )
  .post(
    authController.authenticate,
    authController.authorize("guest", "admin"),
    bookingController.createBooking
  );

router
  .route("/:id")
  .get(
    authController.authenticate,
    authController.authorize("admin", "guest"),
    bookingController.getBooking
  )
  .patch(
    authController.authenticate,
    authController.authorize("guest", "admin"),
    bookingController.updateBooking
  )
  .delete(
    authController.authenticate,
    authController.authorize("guest", "admin"),
    bookingController.deleteBooking
  );

router.get(
  "/getBookingsAfterDate",
  authController.authenticate,
  authController.authorize("guest", "admin"),
  getBookingsAfterDate
);

module.exports = router;
