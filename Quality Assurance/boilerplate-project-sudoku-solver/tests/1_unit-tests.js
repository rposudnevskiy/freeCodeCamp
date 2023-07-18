const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');
let solver = new SudokuSolver();

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const ivalidPuzzle = '1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const  puzzleWithInvalidCharacters = 'A.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
const puzzleIsNot81CharactersInLength = '...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

suite('Unit Tests', () => {
  // #1
  test('Logic handles a valid puzzle string of 81 characters', function () {
    assert.equal(solver.validate(validPuzzle), undefined);
  });
  // #2
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
    assert.notEqual(solver.validate(puzzleWithInvalidCharacters), undefined);
  });
  // #3
  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    assert.notEqual(solver.validate(puzzleIsNot81CharactersInLength), undefined);
  });
  // #4
  test('Logic handles a valid row placement', function () {
    assert.equal(solver.checkCoordinate('A', 1), undefined);
    assert.equal(solver.checkRowPlacement(validPuzzle, 'A', 1, 7), undefined);
  });
  // #5
  test('Logic handles an invalid row placement', function () {
    assert.notEqual(solver.checkCoordinate('AA', 1), undefined);
    assert.notEqual(solver.checkCoordinate('Z', 1), undefined);
    assert.notEqual(solver.checkRowPlacement(validPuzzle, 'A', 1, 1), undefined);
  });
  // #6
  test('Logic handles a valid column placement', function () {
    assert.equal(solver.checkCoordinate('A', 1), undefined);
    assert.equal(solver.checkColPlacement(validPuzzle, 'A', 1, 7), undefined);
  });
  // #7
  test('Logic handles an invalid column placement', function () {
    assert.notEqual(solver.checkCoordinate('A', 0), undefined);
    assert.notEqual(solver.checkCoordinate('A', 10), undefined);
    assert.notEqual(solver.checkColPlacement(validPuzzle, 'A', 1, 1), undefined);
  });
  // #8
  test('Logic handles a valid region (3x3 grid) placement', function () {
    assert.equal(solver.checkRegionPlacement(validPuzzle, 'A', 1, 7), undefined);
  });
  // #9
  test('Logic handles an invalid region (3x3 grid) placement', function () {
    assert.notEqual(solver.checkRegionPlacement(validPuzzle, 'A', 1, 3), undefined);
  });
  // #10
  test('Valid puzzle strings pass the solver', function () {
    assert.equal(solver.solve(validPuzzle)['error'], undefined);
  });
  // #11
  test('Invalid puzzle strings fail the solver', function () {
    assert.notEqual(solver.solve(ivalidPuzzle)['error'], undefined);
  });
  //Solver returns the expected solution for an incomplete puzzle
  // #12
  test('Solver returns the expected solution for an incomplete puzzle', function () {
    let i = Math.floor(Math.random() * (puzzlesAndSolutions.length - 1));
    let puzzle = puzzlesAndSolutions[i][0];
    let solution = puzzlesAndSolutions[i][1];
    assert.equal(solver.solve(puzzle)['error'], undefined);
    assert.notEqual(solver.solve(puzzle)['solution'], undefined);
    assert.equal(solver.solve(puzzle)['solution'], solution);
  });
});
