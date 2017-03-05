var google = require ('googleapis')
var youtube = google.youtube ('v3')
var config = require('../config.js')
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
google.options ({ auth: config.apikey });
module.exports = function (youtubeId,id){
  var searchParams = {
    part:             'id',
    id:                youtubeId
  };
  youtube.videos.list (searchParams, function(err, body) {
    if (err) {
      console.log(err);
      return;
    }
    MongoClient.connect(config.databaseUrl, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err)
      } else {
        if (body.items.length) {
          db.collection(config.collectionName).update({_id:id},{$currentDate:{"lastChecked": true}, $set: {"lastResponse":1}},function (err, numUpdated) {
            if (err) {
              console.log(err)
            } else if (numUpdated) {
              console.log(youtubeId+ 'is available >> ID '+ id)
            } else {
              console.log('No document found with defined "find" criteria!')
            }
            //Close connection
            db.close()
          })
        }
        else {
          db.collection(config.collectionName).update({_id:id},{$currentDate:{"lastChecked": true}, $set: {"lastResponse":0}},function (err, numUpdated) {
            if (err) {
              console.log(err)
            } else if (numUpdated) {
              console.log(youtubeId+ 'is unavailable >> ID '+ id)
            } else {
              console.log('No document found with defined "find" criteria!')
            }
            //Close connection
            db.close()
          })
        }}
      })
    })

  }
