'use strict';

let _ = require('underscore'),
    fs = require('fs'),
    ucfirst = require('ucfirst'),
    validators = {};

class Validator {
    constructor() {
        /**
         * Errors holder
         */
        this.errors;

        /**
         * Rules holder
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
};

/**
 * Check if data is matched to rule
 */
class RuleChecker {

    constructor(rule) {
        /**
         * Error holder
         */
        this.error = '';

        /**
         * Format holder 
         */
        this.format = rule.format;

        if (rule.type == 'email') {
            this.format = 'email'
        }
        this.rule = rule;
    }


    /**
     * Check if data is matched to rule
     */
    isValid(value) {
        let valid = true;
        if (this.rule.required) {
            valid = validators.required(value);
            this.error = `Value is required`;
        } else if (value === undefined || value === null) {
            //value not exists and is not required, ok
            return true;
        }
        if (valid && this.format) {
            valid = validators['checkFormat' + ucfirst(this.rule.type)](value, this.format);
            this.error = `Value: ${value} does not match format ${this.format}`
        }
        return valid;
    }
}

validators.checkFormatDate = (value, format) => {
    let year, month, day, yearFormat, dateRegexp;
    yearFormat = format.split("-").pop();
    dateRegexp = new RegExp(`^[0-9]{2}\-[0-9]{2}-[0-9]{${yearFormat.length}}$`);

    if (!value.match(dateRegexp)) {
        return false;
    }

    [day, month, year] = value.split("-").map((value) => { return parseInt(value) });;
    if (month == 0 || month > 12) {
        return false;
    }
    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }
    return day > 0 && day <= monthLength[month - 1];
}
validators.checkFormatNumber = (value, format) => {
    let requiredAfter, requiredBefore, valueBeforeComma, valueAfterComma;
    [requiredBefore, requiredAfter] = format.split(":");
    [valueBeforeComma, valueAfterComma] = value.split(",");
    return valueBeforeComma.length == requiredBefore
        && valueAfterComma.length == requiredAfter;
}
validators.checkFormatString = (value, format) => {
    let min, max;
    [min, max] = format.split(":");
    return value.length >= min && value.length <= max;
}

validators.checkFormatEmail = (value) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
}

validators.required = (value) => {
    return !_.isNull(value) && !_.isUndefined(value) && value != '';
}

module.exports = new Validator();