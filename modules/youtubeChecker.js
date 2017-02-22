request = require('request-json');
config = require('../config.js');
var client = request.createClient('https://www.googleapis.com/youtube/v3/');

module.exports = function (youtubeId){

  client.get('videos/?part=id&id='+youtubeId+'&key='+config.apikey, function(err, res, body) {
    if (body.items.length) {
      console.log('available');
      return 'true'; // if youtube video exists
    }
    else {
      console.log('unavailable');
      return 'false';
    }
  });
};
