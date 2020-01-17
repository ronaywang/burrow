const mongoose = require("mongoose");


const PhotoSchema = new mongoose.Schema({
    URI: String,
    width: Number,
    height: Number,
    owner: mongoose.ObjectId,
});

module.exports = mongoose.model("photo", PhotoSchema);