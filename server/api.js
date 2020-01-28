/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const upload = require("./upload");
const mime = require("mime-types");
const _ = require("lodash");

// import models so we can interact with the database
const User = require("./models/user");
const Photo = require("./models/photo");
const Listing = require("./models/listing");
const Thread = require("./models/thread");
const Message = require("./models/message");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socket = require("./server-socket");
const gcloudstorage = require("./server-gbucket");

const searchutilities = require("./searchutilities");

function calculateAge(birthday) { // birthday is a date
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

router.post('/login', function(req, res, next) {
    if (req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, function(err, user) {
            if (err || !user) {
                var error = new Error('Wrong email or password');
                error.status = 401;
                return next(error);
            } else {
                req.session.user = user;
                req.user = user;
                const userSkel = {
                  _id: user._id,
                 email: user.email,
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
  newListing.save((err) => {res.send(newListing.creator_ID)});
});

// Edits an existing listing.
router.post("/editlisting", (req, res) => {

})
// Gets all the listings for now (TODO: make into a matching algorithm)
router.post("/matchinglistings", (req, res) => {
  var prefs = req.body;
  console.log(JSON.stringify(prefs));
  const priceMargin = 500; // USD
  const maxDistance = 10; // miles
  let userQuery = { $ne: prefs.userId };
  let noLocation = prefs.location.length === 0 || prefs.location === undefined;
  let priceQuery = {$lte: prefs.price + priceMargin, $gte: prefs.price - priceMargin};
  let listingFilter = searchutilities.filterByDistanceConstructor(prefs.locationCtr, maxDistance);
  const query = {};
  if (prefs.userId.length !== 0)
    query['creator_ID'] = userQuery;
  if (prefs.price !== 0)
    query['price'] = priceQuery;
  if (prefs.durationIndex !== -1)
    query['durationIndex'] = prefs.durationIndex;
  
  console.log(query);
  Listing.find(query).populate({ path: 'creator_ID', select: 'firstName lastName birthdate gender profilePictureURL' })
    .then((listings) => {res.send( noLocation ? listings : listings.filter(listingFilter))});
})

router.post("/logout", auth.logout);
router.get("/getthisuserinfo", async (req, res) => {
  const thisUser = await User.findById(req.query.userId);
  console.log(JSON.stringify(thisUser));
  if (!thisUser){
    res.send("No user found");
  }
  let clonedusr = Object.assign({}, thisUser._doc);
  clonedusr.password = '';
  clonedusr.age = calculateAge(new Date(clonedusr.birthdate));
  clonedusr.isYou = true;
  if (!req.user || req.query.userId !== req.user._id){
    clonedusr.email = '';
    clonedusr.birthdate = '';
    clonedusr.isYou = false;
  }
  res.send(clonedusr);
});

// Gets the composed listings of a user given their id.
// If you send sendself=true, you get back the current user's listings.
// Populates the listings with that user's attributes (admittedly not the fastest way of doing things, but better than separate api calls)
router.get("/composedlistings", (req, res) => {
  Listing.find({creator_ID: _.has(req.query, 'userId') ? req.query.userId : req.user._id})
  .populate({ path: 'creator_ID', select: 'firstName lastName birthdate gender profilePictureURL' })
  .then((info) => res.send({isYou: !_.has(req.query, 'userId') || req.query.userId === req.user._id, listings: info.reverse()}));
});

// Gets the composed listings of a user given their id. Listing IDs only.
// If you send sendself=true, you get back the current user's listings.
router.get("/composedlistings-ids-only", (req, res) => {
  Listing.find({creator_ID: _.has(req.query, 'userId') ? req.query.userId : req.user._id}, '_id').distinct('_id').then((info) => res.send(info));
});

router.get("/myuid", (req, res) => {
  if (_.has(req.user, '_id')) {
    res.send({userId: req.user._id, email: req.user.email, firstName: req.user.firstName, profilePictureURL: req.user.profilePictureURL});
  } else {
    const err = new Error("You are not logged in");
    res.status(401);
    res.send(err);
  }
})

router.post("/deletelisting", (req, res) => {
  Listing.deleteOne({ _id: req.body._id }).then(() => res.send({}));
})

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
  res.send({});
})

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.post("/makeuser", async (req, res) => {
  req.body.email = req.body.email.toLowerCase();
  const newUser = new User ({
    password: req.body.password,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthdate: req.body.birthdate,
    gender: req.body.gender,
    fbProfileLink: "",
    profilePictureURL: "",
    bookmarkedListings: [],
    composedListings: [],
    prefsArray: [1,1,1,1,1],
    aboutMe: "",
  });
  let userClash = await User.findOne({email: req.body.email});
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
    const err = new Error("A user with that email already exists");
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
  if (req.body.gender) {
    myUser.gender = req.body.gender;
  }
  if (req.body.birthdate) {
    myUser.birthdate = req.body.birthdate;
  }
  if (req.body.textBox !== '') {
    myUser.aboutMe = req.body.textBox;
  }
  myUser.prefsArray = req.body.prefsArray;
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

router.get("/getthreads", async (req, res) => {
  const userId = req.user._id;
  let usersThreads = await Thread.find({
    $or: [
      {
        sender_ID: userId
      },
      {
        recipient_ID: userId
      }
    ]
  }).populate({path: "sender_ID", select: "firstName lastName"}).populate({path: "recipient_ID", select: "firstName lastName"});
  res.status(200).send({threads: usersThreads});
});

router.get("/findthreadbyuser", async (req, res) => {
  const thisuserId = req.user._id;
  const otheruserId = req.query.userId;
  let existingThread = await Thread.findOne({
    $or: [
      {
        sender_ID: thisuserId,
        recipient_ID: otheruserId
      },
      {
        sender_ID: otheruserId,
        recipient_ID: thisuserId
      }
    ]
  }).populate({path: "sender_ID", select: "firstName lastName"}).populate({path: "recipient_ID", select: "firstName lastName"});
  if (existingThread !== null) {
    res.send({thread: existingThread});
    console.log(existingThread);
  } else {
    let doesUserExist = await User.findById(req.query.userId);
    if (doesUserExist !== null) {
      let newThread = new Thread({
        sender_ID: thisuserId,
        recipient_ID: otheruserId,
      });
      await newThread.save();
      res.send({thread: newThread.populate({path: "sender_ID", select: "firstName lastName"}).populate({path: "recipient_ID", select: "firstName lastName"})});
      console.log(newThread);
    } else {
      res.status(404).send(new Error("No such user."));
    }
  }
})


router.post("/postmessage", async (req, res) => { // takes body.threadId, body.content, body.timestamp,
  const threadId = req.body.threadId;
  let threadOfInterest = await Thread.findById(threadId);
  if (threadOfInterest === null) {
    const err = new Error("No such thread");
    res.status(404).send(err);
    return;
  }
  let otherUserId;
  if (req.user._id.toString() === threadOfInterest.sender_ID.toString()) {
    otherUserId = threadOfInterest.recipient_ID;
  } else if (req.user._id.toString() === threadOfInterest.recipient_ID.toString()) {
    otherUserId = threadOfInterest.sender_ID;
  } else {
    console.log("neither");
    console.log(req.user._id.toString());
    return;
  }

  const newMessage = new Message({
    sender_ID: req.user._id,
    recipient_ID: otherUserId,
    parentThread_ID: threadId,
    timestamp: req.body.timestamp,
    content: req.body.content,
  });
  newMessage.save().then((thing)=>console.log(thing));
  res.status(200).send({});
  console.log("Sending to " + otherUserId);
  socket.getSocketFromUserID(otherUserId).emit("message", newMessage);
});

router.get("/getmessages", async (req, res) => {
  const threadId = req.query.threadId;
  const messageList = await Message.find({
    parentThread_ID: threadId,
  });
  res.send({messageList: messageList});
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
