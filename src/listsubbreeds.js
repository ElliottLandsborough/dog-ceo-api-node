'use strict';

const AWS = require('aws-sdk');

module.exports.listsubbreeds = (event, context, callback) => {
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

    var i, breed, cleanBreed, split, name, sub;
    var s3BreedList = result.CommonPrefixes;
    var breedListObj = {};

    for (i = 0; i < s3BreedList.length; i++) {
      breed = s3BreedList[i].Prefix;
      cleanBreed = breed.replace(/[^a-z\-]/g,'');
      split = cleanBreed.split('-');
      name = split[0];
      sub = split.length > 1 ? split[1] : false;
      if (typeof breedListObj[name] == 'undefined') {
        breedListObj[name] = [];
      }
      if (sub) {
        breedListObj[name].push(sub);
      }
    }

    var path = event.path;
    var cleanPath = path.replace(/^\/|\/$/g, '');
    var split = cleanPath.split('/');
    var breed = split[1];

    var statusCode;
    var responseObject;

    if (typeof breedListObj[breed] == 'undefined') {
      statusCode = 404;
      responseObject = {status: 'error', code: '404', message: 'Breed not found'};
    } else {
      statusCode = 200;
      responseObject = {status: 'success', message: breedListObj[breed]};
    }

    // create a response
    const response = {
      statusCode: statusCode,
      body: JSON.stringify(responseObject)
    };

    callback(null, response);
  });

};