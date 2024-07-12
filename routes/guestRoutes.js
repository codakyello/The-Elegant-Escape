const router = require("express").Router();
const { getAllGuest, createGuest } = require("../controllers/guestController");

router.route("/").get(getAllGuest).post(createGuest);

module.exports = router;
