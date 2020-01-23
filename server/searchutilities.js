const _ = require("lodash");

// From https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3

const degToRad = (x) => {
  return x * Math.PI / 180;
};

const getDistance = (p1, p2) => {
  const R = 3958.8; // Earth’s mean radius in miles
  const dLat = degToRad(p2.lat - p1.lat);
  const dLong = degToRad(p2.lng - p1.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(p1.lat)) * Math.cos(degToRad(p2.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // angle between two points on their great circle, in radians
  return R * c; // distance in miles is angle times radius
};

const filterByDistanceConstructor = (refPoint, maxDistance) => {
  const filtration = (listing) => {
    if (!_.isUndefined(listing.coordinates.lat)) {
      let p2 = {
        lat: listing.coordinates.lat,
        lng: listing.coordinates.lng,
      };
      return getDistance(refPoint, p2) <= maxDistance;
    } else {
      return false;
    }}
  return filtration;
};


module.exports = { filterByDistanceConstructor };