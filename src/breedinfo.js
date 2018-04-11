'use strict';

const AWS = require('aws-sdk');

module.exports.breedinfo = (event, context, callback) => {
  'use strict';

  var yaml = require('js-yaml');

  const s3 = new AWS.S3({
    region : 'eu-west-1'
  });

  var path = event.path;
  var cleanPath = path.replace(/^\/|\/$/g, '');
  var split = cleanPath.split('/');
  var breed = 'breed-info/' + split[1];

  if (typeof split[2] !== 'undefined') {
    breed += '-' + split[2];
  }

  breed += '.yaml';

  var params = {
    // todo: make this say dev/live/$stage
    Bucket: 'dog-ceo-api-static-content-dev',
    Key: breed
  };

  var statusCode;
  var responseObject;

  s3.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      statusCode = 404;
      responseObject = {status: 'error', code: '404', message: 'Breed not found'};
    } else{
      var array = yaml.safeLoad(data.Body.toString('utf-8'));
      statusCode = 200;
      responseObject = {status: 'success', message: array};
    }

    // create a response
    const response = {
      statusCode: statusCode,
      body: JSON.stringify(responseObject)
    };

    callback(null, response);
  });

};