const router = require("express").Router();

const {
  getAllBooking,
  getBooking,
  createBooking,
  deleteBooking,
  updateBooking,
} = require("../controllers/bookingController");

router.route("/").get(getAllBooking).post(createBooking);

router.route("/:id").get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
