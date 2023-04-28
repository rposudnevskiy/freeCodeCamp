require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const URL = require("url").URL;

const TIMEOUT = 10000;

// -----------------

let isAValidUrl = (url) => {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

let mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const shorturlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: Number
});

let Shorturl = mongoose.model('Shorturl', shorturlSchema);

const findMaxShortUrl = (done) => {
  Shorturl
    .findOne()
    .sort('-short_url')
    .exec(done);
};

const createShortUrl = (url, done) => {
  if (isAValidUrl(url)) {
    findOriginalUrl(url, (err, data) => {
      if (err) {
        return done(err, data);
      } else {
        if (!data) {
          console.log("Orig url not found");
          findMaxShortUrl((err, data) => {
            if (err) {
              return done(err, data);
            } else {
              if (!data) {
                let shurturl = new Shorturl({
                  original_url: url,
                  short_url: 1
                });
                shurturl.save(done);
              } else {
                let shurturl = new Shorturl({
                  original_url: url,
                  short_url: data.short_url + 1
                });
                shurturl.save(done);
              }
            }
          });
        } else {
          console.log("Orig url found");
          done(err, data);
        }
      }
    });
  } else {
    done({ error: 'invalid url' }, null);
  }
};

const findShortUrl = (short_url, done) => {
  Shorturl.findOne({
    short_url: short_url
  }, done);
}

const findOriginalUrl = (original_url, done) => {
  Shorturl.findOne({
    original_url: original_url
  }, done);
}

// -----------------

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// -----------------

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

// Enable request logging
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

app.post("/api/shorturl", function(req, res) {

  let t = setTimeout(() => {
    return res.json({ error: "timeout" });
  }, TIMEOUT);

  createShortUrl(req.body.url, (err, data) => {
    clearTimeout(t);
    if (err) {
      res.json(err);
    } else {
      res.json({
        original_url: data.original_url,
        short_url: data.short_url
      });
    }
  });
});

// Your first API endpoint
app.get('/api/shorturl/:shorturl', function(req, res) {
  let t = setTimeout(() => {
    return res.json({ error: "timeout" });
  }, TIMEOUT);

  findShortUrl(req.params.shorturl, (err, data) => {
    clearTimeout(t);
    if (!data) {
      console.log("Orig url not found");
      res.json({ error: 'invalid shorturl' });
    } else {
      console.log("Orig url found");
      res.redirect(data.original_url);
    }
  });
});

// -----------------

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
