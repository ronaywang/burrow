let gbucket;
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
gbucket = new Storage({keyFilename: "googlecreds.json"});


module.exports = {
  gbucket
}; 