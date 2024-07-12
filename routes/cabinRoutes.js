const express = require("express");
const router = express.Router();
const {
  getAllCabins,
  getCabin,
  createCabin,
  updateCabin,
  deleteCabin,
} = require("../controllers/cabinController");

router.route("/").get(getAllCabins).post(createCabin);

router.route("/:id").get(getCabin).patch(updateCabin).delete(deleteCabin);

module.exports = router;
