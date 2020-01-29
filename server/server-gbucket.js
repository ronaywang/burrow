let gstorage;
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const bucketName = "burrow-bucket";

// Creates a client
gstorage = new Storage({keyFilename: "server/googlecreds.json"});

const uploadFile = async (filename) => {
  // Uploads a local file to the bucket
  await gstorage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    // By setting the option `destination`, you can change the name of the
    // object you are uploading to a bucket.
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  });

  console.log(`${filename} uploaded to ${bucketName}.`);
};


const uploadBuffer = async(filename, buffer) => {
  const bucket = gstorage.bucket(bucketName);
  const file = bucket.file(filename);
  file.save(buffer).then((err)=>{
    if (!err) {
      console.log("Successful upload.");
    } else {
      console.log(err);
    }
  });
};

const deleteFile = async(filename) => {
  const bucket = gstorage.bucket(bucketName);
  const file = bucket.file(filename);
  await file.delete();
};


const gobjURL = (filename) => {
  return "https://storage.googleapis.com/" + bucketName + "/" + filename;
};

module.exports = {
  client: gstorage,
  uploadFile: uploadFile,
  uploadBuffer: uploadBuffer,
  bucketName: bucketName,
  gobjURL: gobjURL,
  deleteFile: deleteFile,
}; 