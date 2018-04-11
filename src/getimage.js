'use strict';

const AWS = require('aws-sdk');

module.exports.getimage = (event, context, callback) => {
  'use strict';

  const s3 = new AWS.S3({
    region : 'eu-west-1'
  });

  var path = event.path;
  var cleanPath = path.replace(/^\/|\/$/g, '');
  var split = cleanPath.split('/');

  var params = {
    Bucket: 'dog-ceo-stanford-files',
    Key: split[1] + '/' + split[2]
  };

  var statusCode;
  var responseObject;
  var body;

  s3.getObject(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
      statusCode = 404;
      body = 'Image not found';
    } else {
      //var array = yaml.safeLoad(data.Body.toString('utf-8'));
      //statusCode = 200;
      //responseObject = {status: 'success', message: array};
      body = 'Image found!';
    }

    // create a response
    const response = {
      statusCode: statusCode,
      body: body
    };

    callback(null, response);
  });

};