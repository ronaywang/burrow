const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    sender_ID: {type: Schema.Types.ObjectId, ref: 'user' },
    recipient_ID: {type: Schema.Types.ObjectId, ref: 'user' },
    parentThread_ID: {type: Schema.Types.ObjectId, ref: 'thread' },
    timestamp: Date,
    content: String,
});

module.exports = mongoose.model("message", MessageSchema);