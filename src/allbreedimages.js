'use strict';

const AWS = require('aws-sdk');

module.exports.allbreedimages = (event, context, callback) => {
  'use strict';

  const s3 = new AWS.S3({
    region : 'eu-west-1'
  });

  var path = event.path;
  var cleanPath = path.replace(/^\/|\/$/g, '');
  var split = cleanPath.split('/');
  var breed = split[1];

  if (split[3] == 'images') {
    breed = breed + '-' + split[2];
  }

  var params = {
    Bucket: 'dog-ceo-stanford-files',
    Delimiter: '',
    Prefix: breed,
    MaxKeys: 10000
  };

  s3.listObjectsV2(params, function (error, result) {
    console.log(result);

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

    var statusCode;
    var responseObject;

    if (!result.Contents.length) {
      statusCode = 404;
      responseObject = {status: 'error', code: '404', message: 'Breed not found'};
    } else {
      statusCode = 200;

      var i;
      var s3ObjectList = result.Contents;
      var filesList = [];

      for (i = 0; i < s3ObjectList.length; i++) {
        filesList.push('https://images.dog.ceo/breeds/' + s3ObjectList[i].Key);
      }

      responseObject = {status: 'success', message: filesList};
    }

    // create a response
    const response = {
      statusCode: statusCode,
      body: JSON.stringify(responseObject)
    };

    callback(null, response);

  });

};