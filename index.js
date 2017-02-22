var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var checkPriority = require('./checkPriority.js');
var youtubeChecker = require('./youtubeChecker.js');

//Configuration
var databaseUrl = 'mongodb://localhost:27017/urlcheck';
var collectionName = 'urls';
var port = 8081;

//Start Server
var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("urlCheck is listening at http://%s:%s", host, port)

});


MongoClient.connect(databaseUrl, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', databaseUrl);

    // Insert
    app.get('/insert', function (req, res) {
      res.sendFile( __dirname + "/" + "insertURL.htm" );
      response = {
        youtubeID:req.query.youtubeID,
        priority:parseInt(req.query.priority),
        lastChecked: new Date(),
        lastResponse: 2 // Response 2 for Unchecked Videos, Remember 0 for unavailable, and 1 for available
      };

      db.collection(collectionName).insert(response, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Inserted %d documents into the "urls" collection. The documents inserted with "_id" are:', result.length, result);
        }

      });
    });

    //Run "Get"
    app.get('/run', function (req, res) {
      res.sendFile( __dirname + "/" + "urlCheck.htm" );
      var cursor = db.collection(collectionName).find();
      cursor.sort({"priority": 1, 'lastChecked': 1});
      cursor.skip(0);

      cursor.each(function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          if(doc !== null){
            //check which video to check
            if (checkPriority(doc.lastChecked,doc.priority)) {
              //check video availablity
              console.log('Now Check ',doc._id, " ", doc.youtubeID); //Debugging
              console.log(youtubeChecker(doc.youtubeID));
            }

        }
        }
      });
    });

  } //End If
}); // End MongoClient
