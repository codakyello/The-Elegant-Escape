const router = require("express").Router();
const authController = require("../controllers/authController");

const guestController = require("../controllers/guestController");

router.post("/signup", authController.guestSignUp);

router.post("/login", authController.guestLogin);

router.post("/getGuest", authController.getGuest);

router.post("/createGuest", authController.createGuest);

router.post("/signIn", authController.guestSignIn);

router.post("/forgotPassword", authController.forgotGuestPassword);

router.patch("/resetPassword/:token", authController.resetGuestPassword);

router.patch(
  "/updatePassword",
  authController.authenticate,
  authController.authorize("guest"),
  authController.updateGuestPassword
);

router.get(
  "/me",
  authController.authenticate,
  authController.authorize("guest"),
  guestController.Me
);

router.patch(
  "/updateMe",
  authController.authenticate,
  authController.authorize("guest"),
  guestController.updateMe
);
router.get(
  "/",
  authController.authenticate,
  authController.authorize("admin"),
  guestController.getAllGuest
);

router.get(
  "/myBookings",
  authController.authenticate,
  authController.authorize("guest"),
  guestController.getMyBookings
);

router
  .route("/:id")
  .get(
    authController.authenticate,
    authController.authorize("admin"),
    guestController.getGuest
  )
  .patch(
    authController.authenticate,
    authController.authorize("admin", "guest"),
    guestController.updateGuest
  )
  .delete(
    authController.authenticate,
    authController.authorize("admin", "guest"),
    guestController.deleteGuest
  );

router
  .route("/:guestId/bookings")
  .get(
    authController.authenticate,
    authController.authorize("admin", "guest"),
    guestController.getGuestBookings
  );

module.exports = router;
