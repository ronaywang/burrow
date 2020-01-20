const mongoose = require("mongoose");


const ListingSchema = new mongoose.Schema({
    creator_ID: mongoose.ObjectId,
    photoList: [mongoose.ObjectId],
    lookingForRoom: Boolean,
    location_ID: mongoose.ObjectId,
    coordinates: { // usual GPS COORDINATES
        lat: Number,
        lng: Number,
    },
    location_radius: Number,
    price: Number,
    startDate: Date,
    endDate: Date,
    smokingFriendly: Boolean,
    petFriendly: Boolean,
    additionalPrefText: String,
});
// A listing determines a search area. If two listings' search areas overlap, then
// they show up on each others' feeds.

module.exports = mongoose.model("listing", ListingSchema);