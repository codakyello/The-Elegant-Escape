const router = require("express").Router();
const settingsController = require("../controllers/settingController");

router
  .route("/")
  .get(settingsController.getSettings)
  .post(settingsController.createSettings)
  .patch(settingsController.updateSettings);

module.exports = router;
