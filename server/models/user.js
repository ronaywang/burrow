const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  firstName: String,
  lastName: String,
  email: String,
  googleid: String,
  birth: Date, // used to calculate AGE
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
