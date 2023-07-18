const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const ivalidPuzzle = '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const puzzleWithInvalidCharacters = 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const puzzleIsNot81CharactersInLength = '...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

chai.use(chaiHttp);

suite('Functional Tests', function() {
  this.timeout(5000);
  // #1
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    let i = Math.floor(Math.random() * (puzzlesAndSolutions.length - 1));
    let puzzle = puzzlesAndSolutions[i][0];
    let solution = puzzlesAndSolutions[i][1];
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ "puzzle": puzzle })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.solution, solution);
        done();
      });
  });
  // #2
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });
  // #3
  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ "puzzle": puzzleWithInvalidCharacters })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  // #4
  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ "puzzle": puzzleIsNot81CharactersInLength })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });
  // #5
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ "puzzle": ivalidPuzzle })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });
  // #6
  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "A1", "value": 7 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isTrue(res.body.valid);
        done();
      });
  });
  // #7
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "A1", "value": 6 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict[0], "column");
        done();
      });
  });
  // #8
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "A1", "value": 1 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict[0], "row");
        assert.equal(res.body.conflict[1], "column");
        done();
      });
  });
  // #9
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "A1", "value": 5 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict[0], "row");
        assert.equal(res.body.conflict[1], "column");
        assert.equal(res.body.conflict[2], "region");
        done();
      });
  });
  // #10
  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "coordinate": "A1", "value": 5 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  // #11
  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "A0", "value": 7 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  // #12
  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "AA10", "value": 7 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  // #13
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "Z1", "value": 7 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  // #14
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({ "puzzle": validPuzzle, "coordinate": "A1", "value": 10 })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
  
});
