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
const axios = require("axios");

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

// for GoogleMaps Autocomplete
const googleMapEndpoint = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const g_apikey = "AIzaSyCR-ulCKD_elY8EERVo4GCa07_ABalJvw8";


// formatParams = (params) => {
//   return Object.keys(params)
//     .map((key) => key + "=" + encodeURIComponent(params[key]))
//     .join("&");
// };
// fullPath = (endpoint, params) => {
//   return endpoint + "?" + formatParams(params);
// };

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

router.get("/newphoto", (req, res) => {
  const newPhoto = new Photo({
    original_filename: 'account.png',
    extension: 'png',
  });
  newPhoto.save();
  res.status(200).send({});
});

// router.get("/locationsuggestions", (req, res) => {
//   /* params: input (string), radius (number) [meters] 
//      For more info, go
//      https://developers.google.com/places/web-service/autocomplete */
//   axios.get(fullPath(googleMapEndpoint, {
//     input: req.query.input,
//     key: g_apikey,
//     radius: req.query.radius
//   })).then((json) => {
//     res.send(json.data);
//   });
// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
