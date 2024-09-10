const express = require("express");
const router = express.Router();
const {
  getAllCabins,
  getCabin,
  createCabin,
  updateCabin,
  deleteCabin,
} = require("../controllers/cabinController");

const authController = require("../controllers/authController");

router
  .route("/")
  .get(getAllCabins)
  .post(
    authController.authenticate,
    authController.authorize("admin"),
    createCabin
  );

router
  .route("/:id")
  .get(
    authController.authenticate,
    authController.authorize("admin", "guests"),
    getCabin
  )
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

module.exports = router;
