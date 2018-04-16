'use strict';

const AWS = require('aws-sdk');

module.exports.listbreeds = (event, context, callback) => {
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
    var breedListArray = [];
    
    for (i = 0; i < s3BreedList.length; i++) { 
      breed = s3BreedList[i].Prefix;
      cleanBreed = breed.replace(/[^a-z\-]/g,'');
      split = cleanBreed.split('-');
      name = split[0];
      sub = split.length > 1 ? split[1] : false;
      if (!breedListArray.includes(name)) {
        breedListArray.push(name);
      }
    }

    // create a response
    var response = {
      statusCode: 200,
      headers: {'cache-control': 'public, max-age=43200'},
      body: JSON.stringify({status: 'success', message: breedListArray})
    };

    callback(null, response);
  });

};