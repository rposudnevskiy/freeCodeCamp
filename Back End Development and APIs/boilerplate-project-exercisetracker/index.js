const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

//---------------------------------------------
const TIMEOUT = 10000;

const bodyParser = require("body-parser");
const mongoose = require('mongoose');

let isValidDate = (date) => {
  try {
    const newDate = new Date(date);
    return true;
  } catch (err) {
    return false;
  }
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
    //_id: false,
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
  }]
});

let User = mongoose.model('Users', userSchema);

const createUser = (username, done) => {
  User.findOne({ username: username })
    .select({ username: 1, _id: 1 })
    .exec((err, data) => {
      if (err) {
        return done(err, data);
      } else {
        if (!data) {
          console.log("User with username " + username + " not found, create new");
          let user = new User({
            username: username
          });
          user.save(done);
        } else {
          console.log("User with username " + username + " exists");
          return done(err, data);
        }
      }
    });
};

const getUsers = (done) => {
  User.find()
    .select({ username: 1, _id: 1 })
    .exec(done);
}

const createExercise = (_id, exerciseObj, done) => {
  User.findOne({ _id: _id })
    .exec((err, data) => {
      if (err) {
        return done(err, data);
      } else {
        if (!data) {
          console.log("User with id " + _id + " not found");
          return done({ error: "User with id " + _id + " not found" }, data);
        } else {
          console.log("User with id " + _id + " exists");
          User.findOneAndUpdate(
            {
              '_id': _id
            },
            {
              $push: {
                log: exerciseObj
              }
            },
            {
              new: true
            })
            .exec((err, data) => {
              if (err) {
                return done(err, data);
              } else {
                return done(null, {
                  _id: data._id,
                  username: data.username,
                  description: data.log[data.log.length - 1].description,
                  duration: data.log[data.log.length - 1].duration,
                  date: data.log[data.log.length - 1].date.toDateString()
                })
              }
            });
        }
      }
    });
};

const findUserExercises = (_id, from, to, limit, done) => {
  // {createdAt:{$gte:ISODate(“2020-03-01”),$lt:ISODate(“2021-03-31”)}}

  let logFilter;
  let sizeFilter;

  if (limit) {
    if (from) {
      if (to) {
        logFilter = {
          $slice: [
            {
              $filter: {
                input: "$log",
                as: "log",
                cond: {
                  $and: [
                    { $gte: ["$$log.date", new Date(from)] },
                    { $lte: ["$$log.date", new Date(to)] }
                  ]
                }
              }
            }, parseInt(limit)
          ]
        };
        sizeFilter = { $size: logFilter };
      } else {
        logFilter = {
          $slice: [
            {
              $filter: {
                input: "$log",
                as: "log",
                cond: { $gte: ["$$log.date", new Date('1990-01-01')] }
              }
            }, parseInt(limit)
          ]
        };
        sizeFilter = { $size: logFilter };
      }
    } else if (to) {
      logFilter = {
        $slice: [
          {
            $filter: {
              input: "$log",
              as: "log",
              cond: { $lte: ["$$log.date", new Date(to)] }
            }
          }, parseInt(limit)
        ]
      };
      sizeFilter = { $size: logFilter };
    } else {
      logFilter = { $slice: ["$log", parseInt(limit)] };
      sizeFilter = { $size: logFilter };
    }
  } else {
    if (from) {
      if (to) {
        logFilter = {
          $filter: {
            input: "$log",
            as: "log",
            cond: {
              $and: [
                { $gte: ["$$log.date", new Date(from)] },
                { $lte: ["$$log.date", new Date(to)] }
              ]
            }
          }
        };
        sizeFilter = { $size: logFilter };
      } else {
        logFilter = {
          $filter: {
            input: "$log",
            as: "log",
            cond: { $gte: ["$$log.date", new Date('1990-01-01')] }
          }
        };
        sizeFilter = { $size: logFilter };
      }
    } else if (to) {
      logFilter = {
        $filter: {
          input: "$log",
          as: "log",
          cond: { $lte: ["$$log.date", new Date(to)] }
        }
      };
      sizeFilter = { $size: logFilter };
    } else {
      logFilter = 1
      sizeFilter = { $size: "$log" }
    }
  }

  User.findOne({ _id: _id })
    .exec((err, data) => {
      if (err) {
        return done(err, data);
      } else {
        if (!data) {
          console.log("User with id " + _id + " not found");
          return done({ error: "User with id " + _id + " not found" }, data);
        } else {
          console.log("User with id " + _id + " exists");
          User.findOne(
            {
              _id: _id
            },
            {
              _id: 1,
              username: 1,
              count: sizeFilter,
              log: logFilter
            }
          )
            .exec((err, data) => {
              if (err) {
                return done(err, data);
              } else {
                //console.log(data);
                jsobj = data.toObject();
                return done(err, {
                  _id: jsobj._id,
                  username: jsobj.username,
                  count: jsobj.count,
                  log: jsobj.log.map( (el) => {
                    return { 
                      description: el.description,
                      duration: el.duration,
                      date: el.date.toDateString()
                    }
                  })
                });
              }
            });
        }
      }
    });
}

//---------------------------------------------

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//---------------------------------------------
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

// Enable request logging
app.use((req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});

// Create a New User:
// POST /api/users

app.post("/api/users", function(req, res) {
  let t = setTimeout(() => {
    return res.json({ error: "timeout" });
  }, TIMEOUT);

  createUser(req.body.username, (err, data) => {
    clearTimeout(t);
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      res.json(data);
    }
  });
});

// List Users:
// GET /api/users
app.get('/api/users', function(req, res) {
  let t = setTimeout(() => {
    return res.json({ error: "timeout" });
  }, TIMEOUT);

  getUsers((err, data) => {
    clearTimeout(t);
    if (data.length === 0) {
      console.log("Users not found");
      res.json(data);
    } else {
      console.log("Users found");
      res.json(data);
    }
  });
});

// Add exercises:
// POST /api/users/:_id/exercises
app.post("/api/users/:_id/exercises", function(req, res) {
  if (isValidDate(req.body.date) || req.body.date === "") {
    if (!isNaN(req.body.duration)) {
      let t = setTimeout(() => {
        return res.json({ error: "timeout" });
      }, TIMEOUT);

      let exercise = {
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date === "" || req.body.date === undefined ? new Date() : req.body.date
      };

      createExercise(req.params._id, exercise, (err, data) => {
        clearTimeout(t);
        if (err) {
          return res.json(err);
        } else {
          res.json(data);
        }
      });
    } else {
      res.json({ error: "Duration is not a number" });
    }
  } else {
    res.json({ error: "Date is invalid" });
  }
});



// GET user's exercise log:
// GET /api/users/:_id/logs?[from][&to][&limit]
// [ ] = optional
// from, to = dates (yyyy-mm-dd); limit = number
app.get('/api/users/:_id/logs', function(req, res) {
  let t = setTimeout(() => {
    return res.json({ error: "timeout" });
  }, TIMEOUT);

  const from = req.query.from === undefined ? undefined : new Date(req.query.from);
  const to = req.query.to === undefined ? undefined : new Date(req.query.to);

  findUserExercises(req.params._id, from, to, req.query.limit, (err, data) => {
    clearTimeout(t);
    if (err) {
      return res.json(err);
    } else {
      res.json(data);
    }
  });
});


//---------------------------------------------

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
