const mongoose = require("mongoose");


const LocationSchema = new mongoose.Schema({
    coordinates: {
        lat: Number,
        lng: Number,
    },
    address: String,
});

module.exports = mongoose.model("location", LocationSchema);