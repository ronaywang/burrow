const mongoose = require("mongoose");


const MessageSchema = new mongoose.Schema({
    sender_ID: mongoose.ObjectId,
    recipient_ID: mongoose.ObjectId,
    listing_ID: mongoose.ObjectId,
    messageNumber: Number,
    parentThread_ID: mongoose.ObjectId,
    timestamp: Date,
});
// A listing determines a search area. If two listings' search areas overlap, then
// they show up on each others' feeds.

module.exports = mongoose.model("message", MessageSchema);