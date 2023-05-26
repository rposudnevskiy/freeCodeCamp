'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function(app) {

  let convertHandler = new ConvertHandler();

  app.route('/api/convert').get((req, res) => {
    let result;
    const initNum = convertHandler.getNum(req.query.input);
    const initUnit = convertHandler.getUnit(req.query.input);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    
    if (!initNum && !initUnit) {
      result = "invalid number and unit"
    } else if (!initNum && initUnit) {
      result = "invalid number"
    } else if (initNum && !initUnit) {
      result = "invalid unit"
    } else {
      const returnNum = convertHandler.convert(initNum, initUnit);
      const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit)
      result = { initNum: initNum, initUnit: initUnit, returnNum: returnNum, returnUnit: returnUnit, string: string }
    }

    res.json(result);
  });

};
