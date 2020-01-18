const mongoose = require("mongoose");


const PhotoSchema = new mongoose.Schema({
    original_filename: String,
    extension: String,   // file extension. filename is _id + '.' + extension
    width: Number,
    height: Number,
    owner: mongoose.ObjectId, // user who owns this file
});

module.exports = mongoose.model("photo", PhotoSchema);