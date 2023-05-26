const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  // #1
  test('convertHandler should correctly read a whole number input', function () {
    assert.isNotNull(convertHandler.getNum('4gal'), 'convertHandler read a whole number input incorrectly');
  });
  // #2
  test('convertHandler should correctly read a decimal number input', function () {
    assert.isNotNull(convertHandler.getNum('5.4lbs'), 'convertHandler read a decimal number input incorrectly');
  })
  // #3
  test('convertHandler should correctly read a fractional input', function () {
    assert.isNotNull(convertHandler.getNum('1/2km'), 'convertHandler read a fractional input incorrectly');
  });
  // #4
  test('convertHandler should correctly read a fractional input with a decimal', function () {
    assert.isNotNull(convertHandler.getNum('5.4/3lbs'), 'convertHandler read a fractional input with a decimal incorrectly');
  });
  // #5  
  test('convertHandler should correctly return an error on a double-fraction', function () {
    assert.isNull(convertHandler.getNum('3/7.2/4kg'), 'convertHandler should correctly return an error on a double-fraction');
  }); 
  // #6
  test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided', function () {
    assert.equal(convertHandler.getNum('kg'), '1', 'convertHandler input is not correctly defaulted to a numerical input of 1 when no numerical input is provided');
  });
  // #7
  test('convertHandler should correctly read each valid input unit', function () {
    assert.isNotNull(convertHandler.getUnit('5.4lbs'), 'convertHandler should correctly read \'lbs\' input unit');
    assert.isNotNull(convertHandler.getUnit('5.4kg'), 'convertHandler should correctly read \'kg\' input unit');
    assert.isNotNull(convertHandler.getUnit('5.4gal'), 'convertHandler should correctly read \'gal\' input unit');
    assert.isNotNull(convertHandler.getUnit('5.4L'), 'convertHandler should correctly read \'L\' input unit');
    assert.isNotNull(convertHandler.getUnit('5.4km'), 'convertHandler should correctly read \'km\' input unit');
    assert.isNotNull(convertHandler.getUnit('5.4mi'), 'convertHandler should correctly read \'mi\' input unit');
  });
  // #8
  test('convertHandler should correctly return an error for an invalid input unit.', function () {
    assert.isNull(convertHandler.getUnit('5.4g'), 'convertHandler should correctly return an error for \'g\' input unit');
    assert.isNull(convertHandler.getUnit('5.4kilomegagram'), 'convertHandler should correctly return an error for \'kilomegagram\' input unit');
  });
  // #9
  test('convertHandler should return the correct return unit for each valid input unit', function () {
    assert.equal(convertHandler.getReturnUnit(convertHandler.getUnit('5.4lbs')), 'kg', 'convertHandler should return \'kg\' return unit for \'lbs\' input unit');
    assert.equal(convertHandler.getReturnUnit(convertHandler.getUnit('5.4kg')), 'lbs', 'convertHandler should return \'lbs\' return unit for \'kg\' input unit');
    assert.equal(convertHandler.getReturnUnit(convertHandler.getUnit('5.4gal')), 'L', 'convertHandler should return \'L\' return unit for \'gal\' input unit');
    assert.equal(convertHandler.getReturnUnit(convertHandler.getUnit('5.4L')), 'gal', 'convertHandler should return \'gal\' return unit for \'L\' input unit');
    assert.equal(convertHandler.getReturnUnit(convertHandler.getUnit('5.4km')), 'mi', 'convertHandler should return \'mi\' return unit for \'km\' input unit');
    assert.equal(convertHandler.getReturnUnit(convertHandler.getUnit('5.4mi')), 'km', 'convertHandler should return \'km\' return unit for \'mi\' input unit');
  });
  // #10 convertHandler should correctly return the spelled-out string unit for each valid input unit
  test('convertHandler should correctly return the spelled-out string unit for each valid input unit', function () {
    assert.equal(convertHandler.spellOutUnit(convertHandler.getUnit('5.4lbs')), 'pounds', 'convertHandler should return \'pounds\' spelled-out string unit for \'lbs\' input unit');
    assert.equal(convertHandler.spellOutUnit(convertHandler.getUnit('5.4kg')), 'kilograms', 'convertHandler should return \'kilograms\' spelled-out string unit for \'kg\' input unit');
    assert.equal(convertHandler.spellOutUnit(convertHandler.getUnit('5.4gal')), 'gallons', 'convertHandler should return \'gallons\' spelled-out string unit for \'gal\' input unit');
    assert.equal(convertHandler.spellOutUnit(convertHandler.getUnit('5.4L')), 'liters', 'convertHandler should return \'liters\' spelled-out string unit for \'L\' input unit');
    assert.equal(convertHandler.spellOutUnit(convertHandler.getUnit('5.4km')), 'kilometers', 'convertHandler should return \'kilometers\' spelled-out string unit for \'km\' input unit');
    assert.equal(convertHandler.spellOutUnit(convertHandler.getUnit('5.4mi')), 'miles', 'convertHandler should return \'miles\' spelled-out string unit for \'mi\' input unit');
  });
  // #11 convertHandler should correctly convert gal to L
  test('convertHandler should correctly convert gal to L', function () {
    assert.equal(convertHandler.convert('5.4', 'gal'), 20.44121, 'gal to L is not converted correctly');
  });
  // #12 convertHandler should correctly convert gal to L
  test('convertHandler should correctly convert L to gal', function () {
    assert.equal(convertHandler.convert('5.4', 'l'), 1.42653, 'L to gal is not converted correctly');
  });
  // #13 convertHandler should correctly convert mi to km
  test('convertHandler should correctly convert mi to km', function () {
    assert.equal(convertHandler.convert('5.4', 'mi'), 8.69044, 'mi to km is not converted correctly');
  });
  // #14 convertHandler should correctly convert km to mi
  test('convertHandler should correctly convert km to mi', function () {
    assert.equal(convertHandler.convert('5.4', 'km'), 3.35541, 'km to mi is not converted correctly');
  });
  // #15 convertHandler should correctly convert lbs to kg
  test('convertHandler should correctly convert lbs to kg', function () {
    assert.equal(convertHandler.convert('5.4', 'lbs'), 2.44940, 'lbs to kg is not converted correctly');
  });
  // #16 convertHandler should correctly convert kg to lbs
  test('convertHandler should correctly convert kg to lbs', function () {
    assert.equal(convertHandler.convert('5.4', 'kg'), 11.90497, 'kg to lbs is not converted correctly');
  });
});
