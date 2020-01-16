const User = require("./models/user");
const bcryptjs = require("bcryptjs");
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
        bcryptjs.hash(pass, saltRounds, (err, hash) => {
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

const signin = (req, res) => {
  User.findOne({username: req.body.username}, (err, person) => {
    if (person && person.passwordhash) {
      if (bcryptjs.compareSync(req.body.password, person.passwordhash)) {
        console.log("Authenticated successfully.");
        req.session.user = {
          _id: person._id,
          username: person.username,
          googleid: person.googleid
        };
        res.send({username: person.username, loggedin: true});
        return true;
      } else {
        console.log("Authentication failed.");
        return false;
      }
    } else {
      console.log("Authentication failed.");
      return false;
    }
  });
};


module.exports = {
  createUser,
  signin,
};

