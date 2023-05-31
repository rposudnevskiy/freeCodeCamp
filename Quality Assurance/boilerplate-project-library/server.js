'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const cors        = require('cors');
require('dotenv').config();

const DB = require('./db/mongo.js');

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

DB(async client => {
  const database = await client.db('personal-library');

  //Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html');
    });
  
  //For FCC testing purposes
  fccTestingRoutes(app);
  
  //Routing for API 
  apiRoutes(app, database);  
      
}).catch(e => {
  app.route('/').get((req, res) => {
    res.status(500)
      .type('text')
      .send('Unable to connect to database');
  });
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
          console.log('Tests are not valid:');
          console.error(e);
      }
    }, 1500);
  }
});

module.exports = app; //for unit/functional testing
