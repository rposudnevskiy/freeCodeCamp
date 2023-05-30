'use strict';

const { ObjectId } = require('mongodb');

module.exports = function(app, issuesDatabase) {

  app.route('/api/issues/:project')

    .get(function(req, res) {
      let project = req.params.project;
      //console.log('--- GET ---');
      //console.log(project);
      //console.log(req.query);

      const projectIssues = issuesDatabase.collection(project);

      if (req.query._id) {
        req.query._id = new ObjectId(req.query._id)
      }

      projectIssues.find(req.query).toArray(
        (err, docs) => {
          if (err) {
            res.json(err);
          } else {
            //console.log(docs);
            res.json(docs);
          }
        }
      );
    })

    .post(function(req, res) {
      let project = req.params.project;
      //console.log('--- POST ---');
      //console.log(project);
      //console.log(req.body);

      const curent_date = new Date();
      const projectIssues = issuesDatabase.collection(project);

      if (req.body.issue_title && req.body.issue_text && req.body.created_by) {
        projectIssues.insertOne(
          {
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_on: curent_date,
            updated_on: curent_date,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to ? req.body.assigned_to : '',
            open: true,
            status_text: req.body.status_text ? req.body.status_text : ''
          },
          { ignoreUndefined: false },
          (err, doc) => {
            if (err) {
              res.json(err);
            } else {
              // The inserted document is held within
              // the ops property of the doc
              res.json(doc.ops[0]);
            }
          }
        )
      } else {
        res.json({ error: 'required field(s) missing' });
      }
    })

    .put(function(req, res) {
      let project = req.params.project;
      //console.log('--- PUT ---');
      //console.log(project);
      //console.log(req.body);

      const curent_date = new Date();
      const projectIssues = issuesDatabase.collection(project);

      if (req.body._id) {
        if (ObjectId.isValid(req.body._id)) {
          const update = {
            issue_title: req.body.issue_title === '' ? undefined : req.body.issue_title,
            issue_text: req.body.issue_text === '' ? undefined : req.body.issue_text,
            updated_on: curent_date,
            created_by: req.body.created_by === '' ? undefined : req.body.created_by,
            assigned_to: req.body.assigned_to === '' ? undefined : req.body.assigned_to,
            open: req.body.open ? false : undefined,
            status_text: req.body.status_text === '' ? undefined : req.body.status_text
          };

          if (update.issue_title || update.issue_text || update.created_by || update.assigned_to || update.status_text || update.open) {
            projectIssues.findOneAndUpdate(
              { _id: new ObjectId(req.body._id) },
              {
                $set: update
              },
              { returnDocument: 'after', ignoreUndefined: true },
              (err, doc) => {
                if (err) {
                  res.json(err);
                } else {
                  if (doc.value) {
                    //console.log(doc.value);
                    res.json({ result: 'successfully updated', '_id': req.body._id });
                  } else {
                    res.json({ error: "could not update", "_id": req.body._id });
                  }
                }
              }
            );
          } else {
            res.json({ error: 'no update field(s) sent', '_id': req.body._id });
          }

        } else {
          res.json({ error: "could not update", "_id": req.body._id });
        }
      } else {
        res.json({ error: 'missing _id' });
      }
    })


    .delete(function(req, res) {
      let project = req.params.project;
      //console.log('--- DELETE ---');
      //console.log(project);
      //console.log(req.body);

      const projectIssues = issuesDatabase.collection(project);

      if (req.body._id) {
        if (ObjectId.isValid(req.body._id)) {
          projectIssues.findOneAndDelete(
            { _id: new ObjectId(req.body._id) },
            (err, doc) => {
              if (err) {
                res.json(err);
              } else {
                if (doc.value) {
                  res.json({ result: 'successfully deleted', '_id': req.body._id });
                } else {
                  res.json({ error: "could not delete", "_id": req.body._id });
                }
              }
            }
          )
        } else {
          res.json({ error: "could not delete", "_id": req.body._id });
        }
      } else {
        res.json({ error: 'missing _id' });
      }

    });

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });

};
