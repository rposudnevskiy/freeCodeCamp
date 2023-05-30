const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  // #1
  test('Create an issue with every field POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/functest')
      .send({"issue_title":"FCTest1","issue_text":"FCTest1","created_by":"prv","assigned_to":"prv", "status_text":"In QA"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "FCTest1");
        assert.equal(res.body.issue_text, "FCTest1");
        assert.equal(res.body.created_by, "prv");
        assert.equal(res.body.assigned_to, "prv");
        assert.equal(res.body.status_text, "In QA");
        assert.isDefined(res.body.created_on);
        assert.isDefined(res.body.updated_on);
        assert.isTrue(res.body.open);
        done();
      });
  });
  // #2
  test('Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/functest')
      .send({"issue_title":"FCTest2","issue_text":"FCTest2","created_by":"prv"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, "FCTest2");
        assert.equal(res.body.issue_text, "FCTest2");
        assert.equal(res.body.created_by, "prv");
        assert.equal(res.body.assigned_to, "");
        assert.equal(res.body.status_text, "");
        assert.isDefined(res.body.created_on);
        assert.isDefined(res.body.updated_on);
        assert.isTrue(res.body.open);
        done();
      });
  });
  // #3
  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/issues/functest')
      .send({"issue_title":"FCTest3"})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "required field(s) missing");
        done();
      });
  });
  // #4
  test('View issues on a project: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functest')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        expect(res.body).to.have.length(2);
        done();
      });
  });
  // #5
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functest?issue_title=FCTest2')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body[0].issue_title, "FCTest2");
        assert.equal(res.body[0].issue_text, "FCTest2");
        assert.equal(res.body[0].created_by, "prv");
        assert.equal(res.body[0].assigned_to, "");
        assert.equal(res.body[0].status_text, "");
        assert.isDefined(res.body[0].created_on);
        assert.isDefined(res.body[0].updated_on);
        assert.isTrue(res.body[0].open);        
        done();
      });
  });
  // #6
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functest?issue_title=FCTest1&created_by=prv')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body[0].issue_title, "FCTest1");
        assert.equal(res.body[0].issue_text, "FCTest1");
        assert.equal(res.body[0].created_by, "prv");
        assert.equal(res.body[0].assigned_to, "prv");
        assert.equal(res.body[0].status_text, "In QA");
        assert.isDefined(res.body[0].created_on);
        assert.isDefined(res.body[0].updated_on);
        assert.isTrue(res.body[0].open);     
        done();
      });
  });
  // #7
  test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functest?issue_title=FCTest2')
      .end(function (err, res) {
        let _id = res.body[0]._id;

        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/functest')
          .send({ "_id": _id, "issue_text": "New FCTest2" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");

            chai
              .request(server)
              .keepOpen()
              .get('/api/issues/functest?issue_title=FCTest2')
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body[0].issue_title, "FCTest2");
                assert.equal(res.body[0].issue_text, "New FCTest2");
                assert.equal(res.body[0].created_by, "prv");
                assert.equal(res.body[0].assigned_to, "");
                assert.equal(res.body[0].status_text, "");
                assert.isDefined(res.body[0].created_on);
                assert.isDefined(res.body[0].updated_on);
                assert.isTrue(res.body[0].open);        
                done();
              });
          });
      });
  });
  // #8
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functest?issue_title=FCTest1')
      .end(function (err, res) {
        let _id = res.body[0]._id;

        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/functest')
          .send({ "_id": _id, "created_by": "rposudn", "assigned_to": "rposudn", "status_text": "Fixed" })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");

            chai
              .request(server)
              .keepOpen()
              .get('/api/issues/functest?issue_title=FCTest1')
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.type, "application/json");
                assert.equal(res.body[0].issue_title, "FCTest1");
                assert.equal(res.body[0].issue_text, "FCTest1");
                assert.equal(res.body[0].created_by, "rposudn");
                assert.equal(res.body[0].assigned_to, "rposudn");
                assert.equal(res.body[0].status_text, "Fixed");
                assert.isDefined(res.body[0].created_on);
                assert.isDefined(res.body[0].updated_on);
                assert.isTrue(res.body[0].open);        
                done();
              });
          });
      });
  });
  // #9
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/functest')
      .send({ "issue_title":"FCTest1", "created_by": "rposudn", "assigned_to": "rposudn", "status_text": "Fixed" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
  // #10
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functest?issue_title=FCTest1')
      .end(function (err, res) {
        let _id = res.body[0]._id;

        chai
          .request(server)
          .keepOpen()
          .put('/api/issues/functest')
          .send({ "_id": _id })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.error, "no update field(s) sent");
            done();
          });
      });  
  });
  // #11
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .put('/api/issues/functest')
      .send({ "_id": "111111111111111111111111", "issue_title":"FCTest1", "created_by": "rposudn", "assigned_to": "rposudn", "status_text": "Fixed" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "could not update");
        assert.equal(res.body._id, "111111111111111111111111");
        done();
      });
  });
  // #12
  test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .get('/api/issues/functest?issue_title=FCTest1')
      .end(function (err, res) {
        let _id = res.body[0]._id;

        chai
          .request(server)
          .keepOpen()
          .delete('/api/issues/functest')
          .send({ "_id": _id })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.result, "successfully deleted");
            assert.equal(res.body._id, _id);
            done();
          });
      });  
  });
  // #13
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/functest')
      .send({ "_id": "111111111111111111111111" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "could not delete");
        assert.equal(res.body._id, "111111111111111111111111");
        done();
      });
  });
  // #14
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete('/api/issues/functest')
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "missing _id");
        done();
      });
  });
});