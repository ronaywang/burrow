const User = require("./models/user");
const bcryptjs = require("bcryptjs");
const saltRounds = 12;


const createUser = (uname, pass) => {
  createUser_async(uname, pass);
};

async function createUser_async (uname, pass) {
  const userscursor = User.find({username: uname});
  let users = [];
  for (let doc = await userscursor.next(); doc != null; doc = await userscursor.next()) {
    users.push(doc);
  }
  if (users.length > 0) {
    console.error("Duplicate usernames.");
  }
  bcryptjs.hash(pass, saltRounds, (err, hash) => {
    const newUser = new User({
      username: uname,
      passhash: hash
    });
    newUser.save();
  });
}

async function getUserHash(uname) {
  const users = await User.find({username: uname});
  if (users.length === 1) {
    return users[0].passhash;
  }
  else {
    console.error("Duplicate usernames.");
  }
}

const authenticate = (uname, password) => {
  const correctHash = getUserHash(uname);
  if (bcryptjs.compareSync(password, correctHash)) {
    return true;
  } else {
    return false;
  }
};


module.exports = {
  createUser,
};

