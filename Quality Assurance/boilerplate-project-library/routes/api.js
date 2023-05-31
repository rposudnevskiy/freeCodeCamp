/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { ObjectId } = require('mongodb');

module.exports = function (app, database) {

  const collection = database.collection('prv');

  app.route('/api/books')
    .get(function (req, res){
      //console.log('--- /api/books - GET ---');
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      collection.find().toArray(
        (err, books) => {
          if (err) {
            res.json(err);
          } else {
            //console.log(books);
            const result = books.map(book => {
              return {
                _id: book._id,
                title: book.title,
                commentcount: book.comments ? book.comments.length : 0
              };
            });
            res.json(result);
          }
        }
      );
    })
    
    .post(function (req, res){
      //console.log('--- /api/books - POST ---');
      //console.log(req.body);
      
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (title) {
        collection.insertOne(
          {
            title: title,
            comments: []
          },
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
        res.json('missing required field title');
      }
    })
    
    .delete(function(req, res){
      //console.log('--- /api/books - DELETE ---');
      //if successful response will be 'complete delete successful'

      collection.deleteMany(
        {},
        (err, books) => {
          if (err) {
            res.json(err);
          } else {
            if (books.result.ok) {
              //console.log(books.deletedCount);
              res.json('complete delete successful');
            } else {
              res.json('could not delete the books');
            }
          }
        }        
      );
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      //console.log('--- /api/books/:id - GET ---');
      //console.log(req.params);
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      if (ObjectId.isValid(bookid)) {
        collection.findOne(
          { _id: new ObjectId(bookid) },
          (err, book) => {
            if (err) {
              res.json(err);
            } else {
              if (book) {
                //console.log(book);
                res.json(book);
              } else {
                res.json('no book exists');
              }              
            }
          }            
        );
      } else {
          res.json("book id '" + bookid + "' is invalid");
      }
    })
    
    .post(function(req, res){
      //console.log('--- /api/books/:id - POST ---');
      //console.log(req.body);
      //console.log(req.params);
      
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (req.body.comment) {
        if (ObjectId.isValid(bookid)) {
          collection.findOneAndUpdate(
            { _id: new ObjectId(bookid) },
            { 
                $push: { "comments": comment }
            },
            { returnDocument: 'after' },
            (err, doc) => {
              if (err) {
                res.json(err);
              } else {
                if (doc.value) {
                  //console.log(doc.value);
                  res.json(doc.value);
                } else {
                  res.json('no book exists');
                }
              }
            }            
          );
        } else {
          res.json("book id '" + bookid + "' is invalid");
        }
      } else {
        res.json('missing required field comment');
      }      
    })
    
    .delete(function(req, res){
      //console.log('--- /api/books/:id - DELETE ---');
      //console.log(req.params);
      
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      if (ObjectId.isValid(bookid)) {
        collection.findOneAndDelete(
          { _id: new ObjectId(bookid) },
          (err, book) => {
            if (err) {
              res.json(err);
            } else {
              if (book.value) {
                //console.log(book.value);
                res.json('delete successful');
              } else {
                res.json('no book exists');
              }              
            }
          }
        );
      } else {
          res.json("book id '" + bookid + "' is invalid");
      }
    });

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });
  
};
