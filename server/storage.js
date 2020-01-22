const moment = require("moment");

function populateSession(req, res, next){
  if (!req.globals){
    req.globals = {
      lookingForRoom: true,
      roomMode: { // used if user's looking for room.
        location: null,
        startDate: moment(),
        endDate: moment().add(1, 'days'),
        price: 0,
        smoking: true,
        pets: true,
      },
      roommateMode: {
        location: null,
        startDate: moment(),
        endDate: moment().add(1, 'days'),
        price: 0,
        smoking: true,
        pets: true,
      }
    }
  }
  next();
}
module.exports = { populateSession };