const mongoose = require("mongoose");


const ThreadSchema = new mongoose.Schema({
    sender_ID: mongoose.ObjectId,
    recipient_ID: mongoose.ObjectId,
    listing_ID: mongoose.ObjectId,
    messages: [mongoose.ObjectId],
});

module.exports = mongoose.model("thread", ThreadSchema);