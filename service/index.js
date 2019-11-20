const express = require('express');
const stackdriver = require('pino-stackdriver');
const pinoms = require('pino-multi-stream');
const projectId = 'abiding-orb-258221';
const writeStream = stackdriver.createWriteStream({ projectId, logName:'testservice' });
const logger = pinoms({ streams: [
  writeStream,
    {level: 'trace', stream: process.stdout},
  ],
});

logger.info('Starting test service');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  logger.info('Request Received');
  res.send('Response!');
});

app.listen(port);