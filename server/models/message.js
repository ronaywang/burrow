const mongoose = require("mongoose");


const MessageSchema = new mongoose.Schema({
    sender_ID: mongoose.ObjectId,
    recipient_ID: mongoose.ObjectId,
    listing_ID: mongoose.ObjectId,
    messageNumber: Number,
    parentThread_ID: mongoose.ObjectId,
    timestamp: Date,
});

module.exports = mongoose.model("message", MessageSchema);