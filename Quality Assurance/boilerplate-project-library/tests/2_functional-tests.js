/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const titleNumber = Math.floor(Math.random() * 100)
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({ "title": "Book title " + titleNumber })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.title, "Book title " + titleNumber, 'Books should contain correct title');
            assert.property(res.body, '_id', 'Books should contain _id');
            done();
          });        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "missing required field title", 'Response should be a correct error message');
            done();
          });   
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get('/api/books')
          .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.type, "application/json");
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const nonExistentId = '111111111111111111111111'
        chai
          .request(server)
          .keepOpen()
          .get('/api/books/' + nonExistentId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "no book exists");
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res) {
            let bookId = res.body[0]._id;

            chai
              .request(server)
              .keepOpen()
              .get('/api/books/' + bookId)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.property(res.body, '_id', 'Books in array should contain _id');
                assert.property(res.body, 'title', 'Books in array should contain title');
                assert.property(res.body, 'comments', 'Books in array should contain comments array');
                assert.isArray(res.body.comments, 'comments should be an array');
                done();
              });
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const commentNumber = Math.floor(Math.random() * 100)
        
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res) {
            let bookId = res.body[0]._id;
            let bookTitle = res.body[0].title;

            chai
              .request(server)
              .keepOpen()
              .post('/api/books/' + bookId)
              .send({ "comment": "Book comment " + commentNumber })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.property(res.body, '_id', 'Books should contain _id');
                assert.property(res.body, 'title', 'Books should contain _id');
                assert.property(res.body, 'comments', 'Books in array should contain comments array');
                assert.equal(res.body.title, bookTitle, 'Books should contain correct title');
                expect("Book comment " + commentNumber).to.be.oneOf(res.body.comments);
                done();                
              });
          
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res) {
            let bookId = res.body[0]._id;
            let bookTitle = res.body[0].title;

            chai
              .request(server)
              .keepOpen()
              .post('/api/books/' + bookId)
              .send({})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body, "missing required field comment", 'Response should be a correct error message');
                done();
              });
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const nonExistentId = '111111111111111111111111'
        const commentNumber = Math.floor(Math.random() * 100)
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/' + nonExistentId)
          .send({ "comment": "Book comment " + commentNumber })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "no book exists", 'Response should be a correct error message');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .keepOpen()
          .get('/api/books')
          .end(function (err, res) {
            let bookId = res.body[0]._id;

            chai
              .request(server)
              .keepOpen()
              .delete('/api/books/' + bookId)
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body, "delete successful", 'Response should be \'delete successful\' for existent book id');
                done();
              });
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const nonExistentId = '111111111111111111111111'
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/' + nonExistentId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body, "no book exists", 'Response should be a correct error message');
            done();
          });
      });

    });

  });

});
