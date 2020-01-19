const mongoose = require("mongoose");
const gcloudstorage = require("../server-gbucket");



const PhotoSchema = new mongoose.Schema({
    originalname: String,
    mimetype: String,
    extension: String,   // file extension. filename is _id + '.' + extension
    width: Number,
    height: Number,
    owner: mongoose.ObjectId, // user who owns this file
});

// it is very important that the following function (and in general mongodb instance methods)
// not be declared using arrows =>, but with function

PhotoSchema.methods.deleteFromBucket = function() {
    gcloudstorage.deleteFile(this._id + "." + this.extension);
};


var Photo = mongoose.model("photo", PhotoSchema);
module.exports = Photo;
