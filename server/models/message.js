const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    sender_ID: {type: Schema.Types.ObjectId, ref: 'user' },
    recipient_ID: {type: Schema.Types.ObjectId, ref: 'user' },
    listing_ID: {type: Schema.Types.ObjectId, ref: 'listing' },
    messageNumber: Number,
    parentThread_ID: {type: Schema.Types.ObjectId, ref: 'thread' },
    timestamp: Date,
});

module.exports = mongoose.model("message", MessageSchema);