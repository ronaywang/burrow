const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  passwordhash: String,
  firstName: String,
  lastName: String,
  email: String,
  googleid: String,
  birth: Date
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
