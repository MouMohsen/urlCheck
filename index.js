var express = require('express')
var app = express()
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var checkPriority = require('./modules/checkPriority.js')
var youtubeChecker = require('./modules/youtubeChecker.js')
var config = require('./config.js')

//Start Server
var server = app.listen(config.port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("urlCheck is listening at http://%s:%s", host, port)
})

app.get('/insert', function (req, res) {
  res.sendFile( __dirname + "/html/" + "insertURL.htm" )
  response = {
    youtubeID:req.query.youtubeID,
    priority:parseInt(req.query.priority),
    lastChecked: new Date(),
    lastResponse: 2 // Response 2 for Unchecked Videos, Remember 0 for unavailable, and 1 for available
  }
  MongoClient.connect(config.databaseUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err)
    } else {
      console.log('Connection established to', config.databaseUrl)
      db.collection(config.collectionName).insert(response, function (err, result) {
        if (err) {
          console.log(err)
        } else {
          console.log('Inserted %d documents into the "urls" collection. The documents inserted with "_id" are:', result.length, result)
        }
      })
      db.close()
    }
  })
})

app.get('/run', function (req, res) {
  res.sendFile( __dirname + "/html/" + "urlCheck.htm" )
  MongoClient.connect(config.databaseUrl, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err)
    } else {
      console.log('Connection established to', config.databaseUrl)
      var cursor = db.collection(config.collectionName).find()
      cursor.sort({"priority": 1, 'lastChecked': 1})
      cursor.skip(0)
      cursor.each(function (err, doc) {
        if (err) {
          console.log(err)
        } else {
          if(doc !== null){
            //check which video to check
            if (checkPriority(doc.lastChecked,doc.priority)) {
              //check video availablity
              // console.log('Now Check ',doc._id, " ", doc.youtubeID) //Debugging
              youtubeChecker(doc.youtubeID,doc._id)
            }
          }
        }
      })
    } //End If
  }) // End MongoClient
})
