# **URL Checker Documentation**

Developed with NodeJS, Mongodb
### Overview
**The service can**
- Receive YoutubeID and Priority and insert them to database.  
- Determine which ID to check based on priority, last checked timestamp, and current time
- Call Youtube API and Check if the video  is available or not
- Update Database with Last Response and Last Check Timestamp

### Prerequisites
**NodeJS v6.9.4**

**NPM 3.10.10**

**MongoDB v3.4.2**

### Installing dependencies
Run `npm install` to install dependencies

### Configurations
#### rename config-sample.js to config.js and provide the following
`databaseUrl` Monogdb URL
`collectionName` Collection Name
`port` Port Number
`apikey` Youtube API Key retrieved from Google API

### QuickStart (Optional)
**This would populate database with examples for Testing**
- Run  `seed-setup` from the root of your project to generate a seed.json file
- Replace `"localhost/LOCAL_DB_NAME"` with the path to your mongodb in your brand new seed.json file
- Edit `collectionName` in config.js to `test`, Or Rename `test.json` to your `collectionName`
- Run `seed`


### Starting Service
#### ```node index.js```


## Insert URLs
#### GET > (Server IP):(Port)/insert?youtubeID=(youtubeID)&priority=(priorityInHours)
*e.g. 127.0.0.1:8081/insert?youtubeID=i6tRU1RTKn2&priority=2*

*app.get(req,res)* will respond to /insert by
- Rendering  /html/insertURL.htm //For Testing Purposes
- Prepare *response* to be inserted to MongoDB
#### response represent the following:
    youtubeID: youtubeID sent by client,
    priority: priority sent by client,
    lastChecked: current Date and Time,
    lastResponse: Response 2 for Unchecked Videos //Default
-  Insert *response* to *urls Collection* using:
#### db.collection(collectionName).insert(response, callback);

## Run Checks
#### GET > (Server IP):(Port)/run
*e.g. 127.0.0.1:8081/run*

*app.get(req,res)* will respond to /run by
- Rendering  /html/urlCheck.htm //For Testing Purposes
- Iterate through collection to get all data stored in database
- Sort data according to priority and lastChecked Date & Time
- Call *checkPriority* module to check if the url need to be checked at *currentDate* which return *true* or *false*
- Call *youtubeChecker* module if *checkPriority* was *true*


## checkPriority module
The function *checkPriority()* takes to arguments *lastChecked* & *priority*
#### Convert priority into Mintues
  `priorityMintues = parseInt(priority*60);`
#### Calculate time difference between currentTime and lastCheckedTime
 `timeDiff = Math.abs(currentTime - lastChecked); //Result in Milliseconds`
#### Convert timeDiff into Mintues
 `diffMintues = Math.ceil(timeDiff / (1000 * 60 ));`
#### If time difference is larger than priority return true, otherwise return false
`if (diffMintues >= priorityMintues )`


## youtubeChecker Module
The function *youtubeChecker()* takes one argument *youtubeId*
- Construct API call, to check if the video is available
- Update URL entry in the database with currentDate (lastChecked Date) and response (1= Available & 0= Unavailable)
