const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({});

exports.module = mongoose.model("Setting", settingSchema);
