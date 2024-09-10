const express = require("express");
const authController = require("../controllers/authController");

const adminController = require("../controllers/adminController");

const router = new express.Router();

router.post("/signup", authController.adminSignUp);

router.post("/login", authController.adminLogin);

router.route("/").get(adminController.getAllAdmins);

router
  .route("/:id")
  .patch(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

module.exports = router;
