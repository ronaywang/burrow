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
const axios = require("axios");
const _ = require("lodash");

// import models so we can interact with the database
const User = require("./models/user");
const Photo = require("./models/photo");
const Listing = require("./models/listing");

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

const searchutilities = require("./searchutilities");

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

// Gets all the info for a user, given "userId"
router.get("/user", (req, res) => {
  User.findOne({_id: req.query.userId})
    .then((info) => res.send(info));
})
// Gets all the info for a listing, given "listingId"
router.get("/listing", (req, res) => {
  Listing.findOne({_id: req.query.listingId})
    .then((info) => res.send(info));
})
// Sends a listing to the schema.
router.post("/listing", (req, res) => {
  let newListing = new Listing(req.body);
  newListing.creator_ID = req.user._id;
  newListing.save((err) => {res.send(newListing._id)});
});
// Gets all the listings for now (TODO: make into a matching algorithm)
router.get("/matchinglistings", (req, res) => {
  var prefs = req.query;
  let userQuery = { $ne: prefs.userId };
  const lookforroom = prefs.lookingForRoom === 'true';
  let priceQuery = prefs.lookingForRoom == 'true' ? {$lte: prefs.price} : {$gte: prefs.price};
  let startDateQuery = prefs.lookingForRoom == 'true' ? {$lte: prefs.startDate} : {$gte: prefs.startDate};
  let endDateQuery = prefs.lookingForRoom == 'true' ? {$gte: prefs.endDate} : {$lte: prefs.endDate};
  let smokingQuery = prefs.smoking == 'true' ? {$in: [true, false]} : false;
  let petQuery = prefs.pets == 'true' ? {$in: [true, false]} : false;
  const maxDistance = 10; // miles
  let listingFilter = searchutilities.filterByDistanceConstructor(lookforroom ? prefs.roomLocationCtr : prefs.roommateLocationCtr, maxDistance);
  Listing.find({
    price: priceQuery,
    startDate: startDateQuery,
    endDate: endDateQuery,
    smokingFriendly: smokingQuery,
    petFriendly: petQuery,
    lookingForRoom: !prefs.lookingForRoom,
  }).then((listings) => {res.send(listings.map(l => ({_id: l._id, coordinates: l.coordinates}).map(listingFilter)))});
})

router.post("/logout", auth.logout);
router.get("/getthisuserinfo", async (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  const thisUser = await User.findById(req.user._id);
  let clonedusr = Object.assign({}, thisUser._doc);
  clonedusr.password = '';
  res.send(clonedusr);
});

// Gets the composed listings of a user given their id.
// If you send sendself=true, you get back the current user's listings.
// Populates the listings with that user's attributes (admittedly not the fastest way of doing things, but better than separate api calls)
router.get("/composedlistings", (req, res) => {
  console.log(req.query);
  Listing.find({creator_ID: _.has(req.query, 'userId') ? req.query.userId : req.user._id})
  .populate({ path: 'creator_ID', select: 'firstName lastName birthdate gender profilePictureURL' }).then((info) => res.send(info.reverse()));
});

// Gets the composed listings of a user given their id. Listing IDs only.
// If you send sendself=true, you get back the current user's listings.
router.get("/composedlistings-ids-only", (req, res) => {
  console.log(req.query);
  Listing.find({creator_ID: _.has(req.query, 'userId') ? req.query.userId : req.user._id}, '_id').distinct('_id').then((info) => res.send(info));
});

router.get("/myuid", (req, res) => {
  if (_.has(req.user, '_id')) {
    res.send({userId: req.user._id, username: req.user.username});
  } else {
    const err = new Error("You are not logged in");
    res.status(401);
    res.send(err);
  }
})

router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  let clonedusr = Object.assign({}, req.user);
  clonedusr.password = '';
  res.send(clonedusr);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socket.addUser(req.user, socket.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/sessionglobals", (req, res) => {
  res.send(req.session.globals);
})

router.post("/sessionglobals", (req, res) => {
  Object.assign(req.session.globals, req.body);
  console.log(`New updated globals are ${JSON.stringify(req.session.globals)}`);
  res.send({});
})

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/makeuser", async (req, res) => {
  const newUser = new User ({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    firstName: "",
    lastName: "",
    birthdate: "",
    gender: "",
    fbProfileLink: "",
    profilePictureURL: "",
    bookmarkedListings: [],
    composedListings: [],
  });
  let userClash = await User.findOne({username: req.body.username});
  if (userClash === null) {
    newUser.save(function(err, result){
      let response;
      if(err) {
        response = { error: true, message: "Error adding data" };
      } else {
        response = { error: false, message: "Data added", _id: result._id };
        res.status(200);
      }
      res.send(response);
    });
  
  } else {
    const err = new Error("A user with that username already exists");
    res.status(409);
    res.send(err);
  }
  //loginstuff.createUser(req.body);
});

router.post("/saveusersettings", async (req, res) => {
  let myUser = await User.findById(req.user._id);
  if (req.body.firstName) {
    myUser.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    myUser.lastName = req.body.lastName;
  }
  if (req.body.fbProfileLink) {
    myUser.fbProfileLink = req.body.fbProfileLink;
  }
  if (req.body.gender !== "") {
    myUser.gender = req.body.gender;
  }
  if (req.body.birthdate) {
    myUser.birthdate = req.body.birthdate;
  }
  if (req.body.textBox !== '') {
    myUser.aboutMe = req.body.textBox;
  }
  await myUser.save();
  res.status(200).send({});
});

router.get("/uploadfile", async (req, res) => {
  await gcloudstorage.uploadFile("/home/chillenb/weblab/ronaywang-chillenb-chrisxu3/client/src/public/assets/account.png");
});

router.post("/getProfilePic", async (req, res) => {
  let userIWant = await User.findById(req.body.userId);
  if (userIWant.profilePictureURL) {
    const replyWithURL = {
      photoURL:  userIWant.profilePictureURL,
    };
    res.status(200).send(replyWithURL);
  } else {
    res.status(503).send({});
  }
});

router.post("/newProfilePic", upload.single('photo'), async (req, res) => {
  if (req.file) {
    let userNewPhoto = new Photo({
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
      let currentUser = await User.findById(req.user._id);
      if (currentUser.profilePicture_ID) {
        let currentPhoto = await Photo.findById(currentUser.profilePicture_ID);
        currentPhoto.deleteFromBucket();
        Photo.deleteOne({_id: currentPhoto._id}).then(()=>{});
      }
      currentUser.profilePicture_ID = userNewPhoto._id;
      currentUser.profilePictureURL = googleURL;
      await currentUser.save();
    }
    return;
  } else {
  }
  if (req.files) {
  }
  res.status(200).send({
    message: "thanks",
    h: req.body,
  });
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
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
