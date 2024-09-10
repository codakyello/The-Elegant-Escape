const express = require("express");
const {
  adminSignUp,
  adminLogin,
  authenticate,
  authorize,
} = require("../controllers/authController");

const {
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

const router = new express.Router();

router.post("/signup", adminSignUp);

router.post("/login", adminLogin);

router.route("/").get(getAllAdmins);

router.route("/:id").patch(updateAdmin).delete(deleteAdmin);

module.exports = router;
