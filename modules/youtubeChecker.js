request = require('request-json');

var client = request.createClient('https://www.googleapis.com/youtube/v3/');

module.exports = function (youtubeId){
 var apikey ='AIzaSyCNya7UgJaK67kqfDXKGrGYFnKVeVFu37w';
 client.get('videos/?part=id&id='+youtubeId+'&key='+apikey, function(err, res, body) {
  if (body.items.length) {
    // console.log('available');
   return 'true'; // if youtube video exists
  }
  else {
    // console.log('unavailable');

   return 'false';
  }
 });
};
