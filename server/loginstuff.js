const User = require("./models/user");
const bcrypt = require("bcrypt");
const saltRounds = 12;


const createUser = (newuser) => {
  createUser_async(newuser.username, newuser.password);
};

function createUser_async (uname, pass) {
  User.findOne({username: uname}, (err, person) => {
    if (person != null) {
      console.error("Duplicate usernames.");
      console.error(person.username);
    } else {
        bcrypt.hash(pass, saltRounds, (err, hash) => {
          console.log(typeof(hash));
        const newUser = new User({
          username: uname, 
          passwordhash: hash
        });
        newUser.save();
        });
      }
    });
  }

const authenticate = (logindata) => {
  User.findOne({username: logindata.username}, (err, person) => {
    if (person.passwordhash) {
      if (bcrypt.compareSync(password, correctHash)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
};


module.exports = {
  createUser,
  authenticate,
};

