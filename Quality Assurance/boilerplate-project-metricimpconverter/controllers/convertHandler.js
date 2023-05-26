mathjs = require('mathjs')

function ConvertHandler() {

  this.getNum = function(input) {
    const re = /(^[0-9.]*\/?[0-9.]*)(\w*)$/;
    if (input.match(re)) {
      if (input.match(re)[1]) {
        return mathjs.evaluate(input.match(re)[1]);
      } else {
        if (input.match(re)[2]) {
          return 1;
        } else {
          return null;
        }
      }
    } else {
      return null;
    }
  };

  this.getUnit = function(input) {
    input = input.toLowerCase();
    const re = /^[0-9./]*(gal|l|mi|km|lbs|kg)$/;
    if (input.match(re)) {
      return input.match(re)[1];
    } else {
      return null
    }
  };

  this.getReturnUnit = function(initUnit) {
    let result;
    switch (initUnit) {
      case 'gal':
        result = 'L';
        break;
      case 'l':
        result = 'gal';
        break;
      case 'mi':
        result = 'km';
        break;
      case 'km':
        result = 'mi';
        break;
      case 'lbs':
        result = 'kg';
        break;
      case 'kg':
        result = 'lbs';
        break;
    }
    return result;
  };

  this.spellOutUnit = function(unit) {
    let result;
    switch (unit) {
      case 'gal':
        result = 'gallons';
        break;
      case 'l':
        result = 'liters';
        break;
      case 'mi':
        result = 'miles';
        break;
      case 'km':
        result = 'kilometers';
        break;
      case 'lbs':
        result = 'pounds';
        break;
      case 'kg':
        result = 'kilograms';
        break;
    }
    return result;
  };

  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'l':
        result = initNum / galToL;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;getString
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
    }

    return parseFloat(result.toFixed(5));
  };

  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return initNum + ' ' + this.spellOutUnit(initUnit) + ' converts to ' + returnNum + ' ' + this.spellOutUnit(returnUnit);
  };

}

module.exports = ConvertHandler;
