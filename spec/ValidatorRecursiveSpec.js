'use strict';
describe("Validator recursive", function() {

    let validator = require('../validator');
    validator.setRules({
        a: { type: 'string', format: '0:5' },
        b: { type: 'number', required: true },
        c: {
          x: { type: 'date', format: 'dd-MM-yy' },
          y: { type: 'email' },
          f: {
            g: { type: 'date', format: 'dd-MM-yyyy' }
          }
        },
        d: {
          type: 'number', format: '2:2'
        }
      });

    it('Should be able to check recursively', function () {
      expect(validator.isValid({
        a: "test", b: 7, c: {
          x: "12-12-16", y: 'test@ex.com', f: {
            g: "01-01-2010"
          }
        },
        d: "02,02"
      })).toBeTruthy();

      expect(validator.isValid({
        a: "test", b: 7, c: {
          x: "12-12-2016", y: 'test', f: {
            g: "1-1-10"
          }
        },
        d: "02,02"
      })).toBeFalsy();
      expect(validator.getErrors().length).toEqual(3);
    });

    it('should check recursively without errors if some data has no rules', function() {
        expect(validator.isValid({b: "3530"})).toBeTruthy();
    })
});
