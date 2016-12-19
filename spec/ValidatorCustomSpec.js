'use strict';
describe("Validator custom", function() {
    let validator = require('../treeValidator');
    it("Should allow to add custom validation rules", function() {
        validator.addCustomRule('not-zero', val => { return val !== 0; });
        validator.setRules({a: {type: 'not-zero', format: true}});
        expect(validator.isValid({a: 5})).toBeTruthy();
        expect(validator.isValid({a: 0})).toBeFalsy();
    })
})