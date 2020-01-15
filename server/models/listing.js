const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({
    users: [String], // list of USER ID's
    smoking: Boolean,
    pets: Boolean,
    cleanliness: Number, // from 0 to 1
    loudness: Number, // from 0 to 1
    price: Number,  // in DOLLARS
    radius: Number, // in MILES
    coordinates: { // usual GPS COORDINATES
        lat: Number,
        long: Number,
    }
});
// A listing determines a search area. If two listings' search areas overlap, then
// they show up on each others' feeds.

module.exports = mongoose.model("listing", listingSchema);