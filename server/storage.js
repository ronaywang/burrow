const moment = require("moment");

function populateSession(req, res, next){
  if (!req.session.globals){
    req.session.globals = {
      lookingForRoom: true,
      location: "",
      locationCtr: {
        lat: 0,
        lng: 0
      },
      startDate: new Date(),
      durationIndex: -1,
      price: 0
    }
  }
  next();
}
module.exports = { populateSession };