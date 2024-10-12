const express = require("express");
const authController = require("../controllers/authController");

const adminController = require("../controllers/adminController");

const router = new express.Router();

router.post(
  "/signup",
  authController.authenticate,
  authController.authorize("admin"),
  authController.adminSignUp
);

router.post("/login", authController.adminLogin);

router
  .route("/")
  .get(
    authController.authenticate,
    authController.authorize("admin"),
    adminController.getAllAdmins
  );

router.patch(
  "/updateMe",
  authController.authenticate,
  authController.authorize("admin"),
  adminController.updateMe
);

router.patch(
  "/updateMyPassword",
  authController.authenticate,
  authController.authorize("admin"),
  authController.updateMyPassword
);

router
  .route("/:id")
  .get(
    authController.authenticate,
    authController.authorize("admin"),
    adminController.getAdmin
  )
  .delete(
    authController.authenticate,
    adminController.isRootAdmin,
    adminController.deleteAdmin
  );

module.exports = router;
