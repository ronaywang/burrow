const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltLength = 12;
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  birthdate: Date,
  gender: String,
  fbProfileLink: String,
  profilePicture_ID: { type: Schema.Types.ObjectId, ref: 'photo' },
  profilePictureURL: String,
  aboutMe: String,
  bookmarkedListings: [{ type: Schema.Types.ObjectId, ref: 'listing' }],
  composedListings: [{ type: Schema.Types.ObjectId, ref: 'listing' }],
  // These are questions with answers from 0 to 2
  prefsArray: Array, // Pets, Cleanliness, Extraversion, Smoking, Early Bird-ness
  // TODO: other questions that determine the user!
});

// authentication
UserSchema.statics.authenticate = (email, password, callback) => {
    User.findOne({email : email})
        .exec(function(err, user) {
            // checking for user
            if (err) {
                return callback(err);
            } else if (!user) {
                let err = new Error('No such user');
                err.status = 401;
                return callback(err);
            }

            bcryptjs.compare(password, user.password, (err, result) => {
                if (result === true) {
                    // user exists, return no error and user
                    return callback(null, user);
                } else {
                    return callback();
                }
            });
        });
};

// hash passwords with bcryptjs
UserSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password')) return next();

    bcryptjs.hash(user.password, saltLength, (err, hash) => {
        if (err) {
            return next(err);
        } else {
          user.password = hash;
          next();
        }
    })
});

// compile model from schema
var User = mongoose.model("user", UserSchema);
module.exports = User;

