'use strict';

const AWS = require('aws-sdk');

module.exports.randomimageanybreed = (event, context, callback) => {
  'use strict';

  const s3 = new AWS.S3({
    region : 'eu-west-1'
  });

  var params = {
    Bucket: 'dog-ceo-stanford-files',
    Delimiter: "/",
    Prefix: "",
    MaxKeys: 1000000
  };

  s3.listObjectsV2(params, function (error, result) {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the folders.'
      });
      return;
    }

    var s3BreedList = result.CommonPrefixes;
    var s3RandomBreed = s3BreedList[Math.floor(Math.random()*s3BreedList.length)];
    var breed = s3RandomBreed.Prefix;
    var cleanBreed = breed.replace(/[^a-z\-]/g,'');

    var params = {
      Bucket: 'dog-ceo-stanford-files',
      Delimiter: '',
      Prefix: cleanBreed + '/',
      MaxKeys: 1000
    };

    s3.listObjectsV2(params, function (error, result) {

      var s3BreedObjects = result.Contents;
      var s3Object = s3BreedObjects[Math.floor(Math.random()*s3BreedObjects.length)];
      var s3File = 'https://images.dog.ceo/breeds/' + s3Object.Key;

      var responseObject = {status: 'success', message: s3File};

      // create a response
      var response = {
        statusCode: 200,
        headers: {'cache-control': 'private, no-cache'},
        body: JSON.stringify(responseObject)
      };

      callback(null, response);

    });
  });

};