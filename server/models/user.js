const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  birth: Date, // used to calculate AGE
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
