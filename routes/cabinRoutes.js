const express = require("express");
const router = express.Router();
const {
  getAllCabins,
  getCabin,
  createCabin,
  updateCabin,
  deleteCabin,
  getCabinBookedDates,
} = require("../controllers/cabinController");

const authController = require("../controllers/authController");

router.route("/").get(getAllCabins).post(
  authController.authenticate,

  createCabin
);

router
  .route("/:id")
  .get(getCabin)
  .patch(
    authController.authenticate,
    authController.authorize("admin", "guests"),
    updateCabin
  )
  .delete(
    authController.authenticate,
    authController.authorize("admin"),
    deleteCabin
  );

router.get("/:id/bookings", getCabinBookedDates);

module.exports = router;
