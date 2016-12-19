'use strict'
describe('Validator', function () {
  let validator = require('../treeValidator');

  describe('should process rules', function () {
    it('Should have isValid() method', function () {
      expect(validator.isValid).toBeDefined();
    });

    it('Should invalid empty|undefined required values', function () {
      validator.setRules({ b: { required: true, type: 'number' } });
      expect(validator.isValid({ b: '' })).toBeFalsy();
      expect(validator.isValid({ b: null })).toBeFalsy();
      expect(validator.isValid({ b: undefined })).toBeFalsy();
      expect(validator.isValid({})).toBeFalsy();
      expect(validator.isValid({ b: 11 })).toBeTruthy();
      expect(validator.isValid({ b: '22' })).toBeTruthy();
    });

    it('Should be able to check string format', function () {
      validator.setRules({
        someString: {
          type: 'string',
          format: '2:5'
        }
      });
      expect(validator.isValid({ someString: 'test' })).toBeTruthy();
      expect(validator.isValid({ someString: 'test-test' })).toBeFalsy();
      expect(validator.isValid({ someString: 't' })).toBeFalsy();
    });

    it('Should be able to check email format', function () {
      validator.setRules({
        someEmail: {
          type: 'email',
        }
      });
      expect(validator.isValid({ someEmail: 'test@ex.com' })).toBeTruthy();
      expect(validator.isValid({ someEmail: 'test-test' })).toBeFalsy();
      expect(validator.isValid({ someEmail: 't' })).toBeFalsy();
    });

    it('Should be able to check nubmer formats', function () {
      validator.setRules({
        someNumber: {
          type: 'number',
          format: '2:3'
        }
      });
      expect(validator.isValid({ someNumber: "22,333" })).toBeTruthy();
      expect(validator.isValid({ someNumber: "22,33" })).toBeFalsy();
      expect(validator.isValid({ someNumber: "2,333" })).toBeFalsy();
      expect(validator.isValid({ someNumber: "02,000" })).toBeTruthy();
    });

    it('Should be able to check date format', function () {
      validator.setRules({
        dateShortYear: {
          type: 'date',
          format: 'dd-MM-yy'
        },
        dateLongYear: {
          type: 'date',
          format: 'dd-MM-YYYY',
        }
      });
      expect(validator.isValid({ dateShortYear: '31-12-03' })).toBeTruthy();
      expect(validator.isValid({ dateShortYear: '31-12-2003' })).toBeFalsy();
      expect(validator.isValid({ dateLongYear: '31-12-03' })).toBeFalsy();
      expect(validator.isValid({ dateLongYear: '31-12-2003' })).toBeTruthy();
    });
  });
}); 
