let rulesCollection = require('./rulesCollection'),
    _ = require('underscore')
;

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
            valid = rulesCollection.get('required')(value);
            this.error = `Value is required`;
        } else if (value === undefined || value === null) {
            //value not exists and is not required, ok
            return true;
        }
        if (valid && this.format) {
            valid = rulesCollection.get(this.rule.type)(value, this.format);
            this.error = `Value: ${value} does not match format ${this.format}`
        }
        return valid;
    }
    static getRulesCollection() {
        return rulesCollection;
    }
}

module.exports = RuleChecker;