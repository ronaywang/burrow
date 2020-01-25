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
      startDate: moment(),
      endDate: moment().add(1, 'days'),
      price: 0,
      smoking: true,
      pets: true,
    }
  }
  next();
}
module.exports = { populateSession };