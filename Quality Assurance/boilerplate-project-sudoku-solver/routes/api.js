'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      //console.log('--- /api/check - POST ---');
      //console.log(req.body)

      if (req.body.coordinate && req.body.value && req.body.puzzle) {
      
        let puzzle = req.body.puzzle;
        let coord = req.body.coordinate.match(/([A-Z]*)(\d*)/);
        let row = coord[1]; // A of 'A1' coordinate
        let column = coord[2]; // 1 of 'A1' coordinate
        let value = req.body.value; // '1'
  
        // Response exmples
        // { "valid": false, "conflict": [ "row", "column" ] }
        // { "valid": false, "conflict": [ "row", "column", "region" ] }
        // { "valid": true }
  
        let error = solver.validate(puzzle); 
        if (!error) {
          
          let error = solver.checkCoordinate(row, column); 
          if (!error) {
            
            let error = solver.checkValue(value); 
            if (!error) {
              
              let conflicts = [];
        
              if (solver.checkRowPlacement(puzzle, row, column, value)) {
                conflicts.push('row');
              }
              
              if (solver.checkColPlacement(puzzle, row, column, value)) {
                conflicts.push('column');
              };
              
              if (solver.checkRegionPlacement(puzzle, row, column, value)) {
                conflicts.push('region');
              }
        
              if (conflicts.length != 0) {
                return res.json({ valid: false, conflict: conflicts });
              } else {
                return res.json({ valid: true });
              }
            
            } else {
              return res.json(error);
            }
          } else {
            return res.json(error);
          }
        } else {
          return res.json(error);
        }
      } else {  
        return res.json({ error: "Required field(s) missing" });
      }
  
    });

  app.route('/api/solve')
    .post((req, res) => {
      //console.log('--- /api/solve - POST ---');
      //console.log(req.body)

      if (!req.body.puzzle) {
        return res.json({ error: "Required field missing" });
      }
      
      let puzzle = req.body.puzzle
      let error = solver.validate(puzzle); 

      if (error) {
        return res.json(error);
      } else {
        return res.json(solver.solve(puzzle));     
      }
    });
};
