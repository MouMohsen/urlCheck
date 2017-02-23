request = require('request-json')
config = require('../config.js')
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var client = request.createClient('https://www.googleapis.com/youtube/v3/')

module.exports = function (youtubeId,id){

  client.get('videos/?part=id&id='+youtubeId+'&key='+config.apikey, function(err, res, body) {
    MongoClient.connect(config.databaseUrl, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err)
      } else {
        if (body.items.length) {
          console.log(id,'youtubeID',youtubeId,'available')
          db.collection(config.collectionName).update({_id:id},{$currentDate:{"lastChecked": true}, $set: {"lastResponse":1}},function (err, numUpdated) {
            if (err) {
              console.log(err)
            } else if (numUpdated) {
              console.log('Updated Successfully %d document(s).', numUpdated)
            } else {
              console.log('No document found with defined "find" criteria!')
            }
            //Close connection
            db.close()
          })
        }
        else {
          console.log(id,'youtubeID',youtubeId,'available')
          db.collection(config.collectionName).update({_id:id},{$currentDate:{"lastChecked": true}, $set: {"lastResponse":0}},function (err, numUpdated) {
            if (err) {
              console.log(err)
            } else if (numUpdated) {
              console.log('Updated  %d document(s).', numUpdated)
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
