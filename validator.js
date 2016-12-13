'use strict';

let _ = require('underscore'),
    fs = require('fs'),
    RuleChecker = require('./ruleChecker')
    ;

class Validator {
    constructor() {
        /**
         * Errors holder
         */
        this.errors;

        /**
         * Rules difinitions holder
         */
        this.rules = {};
    }


    /**
     * Validate if rules are correct
     * @param {Object} data to be checked
     * @param {Object} rules to check if data is matched to
     * @return {Validator} Validator instance
     */
    validate(data, rules) {
        let ruleValidator;
        this.errors = [];
        let gen = this.getGenerator(rules, data);
        for (let [field, rule, value] of gen) {
            ruleValidator = new RuleChecker(rule);
            if (!ruleValidator.isValid(value)) {
                this.errors.push(`Error for ${field} - ${ruleValidator.error}`);
            }
        }
        return this;
    }

    /**
     * Recursively goes through the tree of rules
     * @return {Generator} 
     */
    *getGenerator(rules, data) {
        let value = null;
        for (let field in rules) {
            value = null;
            if (_.has(data, field)) {
                value = data[field];
            }

            if (rules[field].type) {
                yield [field, rules[field], value];
            } else {
                yield* this.getGenerator(rules[field], value);
            }
        }
    }

    /**
     * Rules setter
     */
    setRules(rules) {
        this.rules = rules;
    }

    /**
     * Whether data is valid
     * @param object optional data to be validated
     * @return boolean
     */
    isValid(data) {
        if (data) {
            this.validate(data, this.rules);
        }
        return this.errors.length == 0;
    }
    /**
     * Get validation errors
     * @return array
     */
    getErrors() {
        return this.errors;
    }

    readRulesFromFile(fileName) {
        fileName = fileName || 'rules.json';
        this.setRules(JSON.parse(fs.readFileSync(fileName, 'utf8')));
    }
    getRuleChecker() {
        return RuleChecker;
    }
};


module.exports = new Validator();