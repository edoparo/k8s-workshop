const express = require('express');
const stackdriver = require('pino-stackdriver');
const pinoms = require('pino-multi-stream');
const projectId = 'abiding-orb-258221';
const writeStream = stackdriver.createWriteStream({ projectId, logName:'testservice' });
const MongoClient = require('mongodb').MongoClient;
const {mongo_url} = require('./conf/config');
const {MONGO_ROOT_USERNAME:username, MONGO_ROOT_PASSWORD:password} = process.env;

// Connection URL
const url = `mongodb://${username}:${password}@${mongo_url}:27017`;

// Database Name
const dbName = 'test';
let dbClient;

// Use connect method to connect to the server
(async ()=> {dbClient = (await MongoClient.connect(url)).db(dbName)})();

const findDocuments = async function(db) {
  // Get the documents collection
  const collection = db.collection('testcollection');
  // Find some documents
  return collection.find({}).toArray();
}

const logger = pinoms({ streams: [
  writeStream,
    {level: 'trace', stream: process.stdout},
  ],
});

logger.info('Starting test service');
logger.info('url is: ' + url);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  logger.info('Request Received');
  findDocuments(dbClient)
      .then((result) => {
        logger.info(' retrieved: ' + JSON.stringify(result))
        res.send('Response! ' + JSON.stringify(result))
      })
      .catch((e)=>{
        logger.error(e, 'Errore')
        res.send('MANNAGGIA' + e.message)
      });
});

app.listen(port);