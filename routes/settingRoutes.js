const router = require("express").Router();
const settingsController = require("../controllers/settingController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(settingsController.getSettings)
  .post(
    authController.authenticate,
    authController.authorize("admin"),
    settingsController.createSettings
  )
  .patch(
    authController.authenticate,
    authController.authorize("admin"),
    settingsController.updateSettings
  );

module.exports = router;
