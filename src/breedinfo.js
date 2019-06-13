'use strict';

const AWS = require('aws-sdk');

module.exports.breedinfo = (event, context, callback) => {
  'use strict';

  var yaml = require('js-yaml');

  const s3 = new AWS.S3({
    region : 'eu-west-1'
  });

  var breed = '';
  var breed2 = '';

  if (event.pathParameters) {
    breed = event.pathParameters.breed;
    breed2 = event.pathParameters.breed2;
  }

  if (typeof breed2 !== 'undefined') {
    breed = breed + '-' + breed2;
  }

  breed = 'breed-info/' + breed + '.yaml';

  var params = {
    // todo: make this say dev/live/$stage
    Bucket: 'dog-ceo-api-static-content-dev',
    Key: breed
  };

  var statusCode;
  var responseObject;

  s3.getObject(params, function(err, data) {
    if (err) {
      //console.log(err, err.stack); // an error occurred
      statusCode = 404;
      responseObject = {status: 'error', code: '404', message: 'Breed not found'};
    } else {
      var array = yaml.safeLoad(data.Body.toString('utf-8'));
      statusCode = 200;
      responseObject = {status: 'success', message: array};
    }

    // create a response
    var response = {
      statusCode: statusCode,
      headers: {'cache-control': 'public, max-age=43200'},
      body: JSON.stringify(responseObject)
    };

    callback(null, response);
  });

};