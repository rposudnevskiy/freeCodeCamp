const rowStartIndexes = {
  A: 0,
  B: 9,
  C: 18,
  D: 27,
  E: 36,
  F: 45,
  G: 54,
  H: 63,
  I: 72
};

const regionIndexes = [
  [0, 1, 2, 9, 10, 11, 18, 19, 20],
  [3, 4, 5, 12, 13, 14, 21, 22, 23],
  [6, 7, 8, 15, 16, 17, 24, 25, 26],
  [27, 28, 29, 36, 37, 38, 45, 46, 47],
  [30, 31, 32, 39, 40, 41, 48, 49, 50],
  [33, 34, 35, 42, 43, 44, 51, 52, 53],
  [54, 55, 56, 63, 64, 65, 72, 73, 74],
  [57, 58, 59, 66, 67, 68, 75, 76, 77],
  [60, 61, 62, 69, 79, 71, 78, 79, 80]
];

const product = (...arrs) => {
  if (arrs.length > 2) {
    let a = arrs.shift();
    return a.reduce((p, x) => [...p, ...product(...arrs).map(y => [x, ...y])], []);
  } else {
    return arrs[0].reduce((p, x) => [...p, ...arrs[1].map(y => [x, y])], []);
  }
}

const range = (...args) => {
  if (args.length == 1)
    return [...Array(args[0]).keys()];
  else if (args.length == 2)
    return [...Array(args[1]).keys()].map(i => i + args[0]);
  else if (args.length == 3)
    return [...Array(args[1]).keys()].map(i => i * args[2] + args[0]);
};

class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    } else {
      if (puzzleString.match(/[^1-9.]/)) {
        return { error: "Invalid characters in puzzle" };
      }
    }
  }

  checkCoordinate(row, column) {
    if (rowStartIndexes.hasOwnProperty(row)) {
       if (isNaN(column) || column < 1 || column > 9) {
          return { error: "Invalid coordinate" };
       }
    } else {
      return { error: "Invalid coordinate" };
    }
  }

  checkValue(value) {
    if (isNaN(value) || value < 1 || value > 9) {
        return { error: 'Invalid value' };
    }
  }
  
  checkRowPlacement(puzzleString, row, column, value) {
    for (let c = 0; c < 9; c++) {
      if ((puzzleString[rowStartIndexes[row] + c] == value && c != column - 1 ) ||
         (puzzleString[rowStartIndexes[row] + c] != value &&
          puzzleString[rowStartIndexes[row] + c] != '.' && c == column - 1 )) {
        return { error: 'Row conflict' };
      }
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (const r of Object.keys(rowStartIndexes)) {
      if ((puzzleString[rowStartIndexes[r] + parseInt(column) - 1] == value && r != row) ||
         (puzzleString[rowStartIndexes[r] + parseInt(column) - 1] != value &&
          puzzleString[rowStartIndexes[r] + parseInt(column) - 1] != '.' && r == row)) {
        return { error: 'Column conflict' };
      }
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const region = regionIndexes[~~(row / 3) * 3 + ~~(column / 3)];
    
    if (region) {
      for (let i = 0; i < 9; i++) {
        if (puzzleString[region[i]] == value) {
          return { error: 'Region conflict' };
          break;
        }
      }
    }
  }

  _select(X, Y, r) {
    let cols = [];
    for (const j of Y[r]) {
      if (X[j] != undefined) {
        for (const i of X[j]) {
          for (const k of Y[i]) {
            if (k != j) {
              X[k].splice(X[k].indexOf(i), 1);
            }
          }
        }
        cols.push(X[j]);
        delete X[j];
      } else {
        return;
      }
    }
    return cols;
  }

  _deselect(X, Y, r, cols) {
    for (const j of Y[r].reverse()) {
      X[j] = cols.pop();
      for (const i of X[j]) {
        for (const k of Y[i]) {
          if (k != j) {
            X[k].push(i);
          }
        }
      }
    }
  }

  _solve(X, Y, solution) {
    if (!Object.keys(X).length) {
        return solution;
    } else {
        let c = -1;
        for (const [k, v] of Object.entries(X)) {
          if (c == -1) {
            c = k;
          } else {
            if (X[k] < X[c]) {
              c = k;
            }
          }
        }
        for (const r of X[c]) {
          solution.push(r);
          let cols = this._select(X, Y, r);
          const ret = this._solve(X, Y, solution)
          if (ret) {
            return ret;  
          } else {
            this._deselect(X, Y, r, cols);
            solution.pop();          
          }
        }
    }
  }
  
  solve(puzzleString) {
    let X = {}

    for (const e of [...product(range(9), range(9)).map(y => ['rc', ...y].toString()),
    ...product(range(9), range(1, 9)).map(y => ['rn', ...y].toString()),
    ...product(range(9), range(1, 9)).map(y => ['cn', ...y].toString()),
    ...product(range(9), range(1, 9)).map(y => ['bn', ...y].toString())]) {
      X[e] = [];
    };

    let Y = {};

    for (const e of product(range(9), range(9), range(1, 9))) {
      const r = e[0];
      const c = e[1];
      const n = e[2];
      const b = ~~(r / 3) * 3 + ~~(c / 3); // Region number
      Y[[r, c, n]] = [
        ["rc", r, c].toString(),
        ["rn", r, n].toString(),
        ["cn", c, n].toString(),
        ["bn", b, n].toString()];
    };

    for (const k in Y) {
      for (const e of Y[k]) {
        X[e].push(k)
      }
    }

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzleString[(i*9) + j] != '.') {
          if (!this._select(X, Y, [i, j, puzzleString[(i*9) + j]])) {
            return { error: "Puzzle cannot be solved" };
          }
        }
      }
    }
    
    let solution = puzzleString.split("");
    for (const s of this._solve(X, Y, [])) {
      solution[(parseInt(s[0])*9) + parseInt(s[2])] = s[4];
    }
    return { solution: solution.join("") };
  }

}

module.exports = SudokuSolver;