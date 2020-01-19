/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const upload = require("./upload");
const mime = require("mime-types");

// import models so we can interact with the database
const User = require("./models/user");
const Photo = require("./models/photo");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");
const gcloudstorage = require("./server-gbucket");

router.post('/login', function(req, res, next) {
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function(err, user) {
            if (err || !user) {
                var error = new Error('Wrong username or password');
                error.status = 401;
                return next(error);
            } else {
                req.session.user = user;
                req.user = user;
                const userSkel = {
                  _id: user._id,
                  username: user.username,
                };
                res.send(userSkel);
            }
        });
    } else {
        var error = new Error('All fields required');
        error.status = 401;
        return next(error);
    }
});


router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/makeuser", async (req, res) => {
  const newUser = new User ({
    username: req.body.username,
    password: req.body.password,
  });
  userClash = await User.findOne({username: req.body.username});
  if (userClash === null) {
  newUser.save();
  res.status(200);
  res.send({});
  } else {
    console.log("conflict");
    err = new Error("A user with that username already exists");
    res.status(409);
    res.send(err);
  }
  //loginstuff.createUser(req.body);
});

router.post("/passlogin", (req, res) => {
  //loginstuff.signin(req, res);
});

router.get("/uploadfile", async (req, res) => {
  await gcloudstorage.uploadFile("/home/chillenb/weblab/ronaywang-chillenb-chrisxu3/client/src/public/assets/account.png");
});



router.post("/newProfilePic", upload.single('photo'), async (req, res) => {
  if (req.file) {
    console.log("got file");
    console.log(req.file);
    userNewPhoto = new Photo({
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      extension: mime.extension(req.file.mimetype),
    });
    gcloudstorage.uploadBuffer(userNewPhoto._id + '.' + userNewPhoto.extension, req.file.buffer);
    userNewPhoto.save();
    const googleURL = gcloudstorage.gobjURL(userNewPhoto._id + "." + userNewPhoto.extension);
    res.status(200).send({
      message: "thanks",
      url: googleURL,
    });
    if (req.user._id) {
      console.log(req.user);
      currentUser = await User.findById(req.user._id);
      currentUser.profilePicture_ID = userNewPhoto._id;
      currentUser.profilePictureURL = googleURL;
      await currentUser.save();
      console.log(currentUser);
    }
    return;
  } else {
    console.log("no file");
  }
  if (req.files) {
    console.log("got files");
    console.log(req.files);
  }
  res.status(200).send({
    message: "thanks",
    h: req.body,
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
