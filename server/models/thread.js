const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadSchema = new mongoose.Schema({
    sender_ID: { type: Schema.Types.ObjectId, ref: 'user' },
    recipient_ID: { type: Schema.Types.ObjectId, ref: 'user' },
});

module.exports = mongoose.model("thread", ThreadSchema);