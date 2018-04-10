'use strict';

const AWS = require('aws-sdk');

module.exports.listallbreeds = (event, context, callback) => {
  'use strict';

  const s3 = new AWS.S3({
    region : 'eu-west-1'
  });

  var params = {
    Bucket: 'dog-ceo-stanford-files'
  };

  s3.listObjects(params, function (error, result) {
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

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    };

    callback(null, response);
  });

};