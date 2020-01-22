const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new mongoose.Schema({
    creator_ID: {type: Schema.Types.ObjectId, ref: 'user' },
    photoList: [{type: Schema.Types.ObjectId, ref: 'photo' }],
    lookingForRoom: Boolean,
    location: String,
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