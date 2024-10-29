const router = require("express").Router();
const authController = require("../controllers/authController");
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

router.get(
  "/getBookingsAfterDate",
  authController.authenticate,
  authController.authorize("guest", "admin"),
  bookingController.getBookingsAfterDate
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

module.exports = router;
