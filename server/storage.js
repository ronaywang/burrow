const moment = require("moment");

function populateSession(req, res, next){
  if (!req.session.globals){
    req.session.globals = {
      lookingForRoom: true,
      roomLocation: "",
      roomLocationCtr: {
        lat: 0,
        lng: 0
      },
      roomStartDate: moment(),
      roomEndDate: moment().add(1, 'days'),
      roomPrice: 0,
      roomSmoking: true,
      roomPets: true,
      roommateLocation: "",
      roommateLocationCtr: {
        lat: 0,
        lng: 0
      },
      roommateStartDate: moment(),
      roommateEndDate: moment().add(1, 'days'),
      roommatePrice: 0,
      roommateSmoking: true,
      roommatePets: true,
    }
  }
  next();
}
module.exports = { populateSession };