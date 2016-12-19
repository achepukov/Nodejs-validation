let _ = require('underscore');

/**
 * Validate if data is matched
 */
class ItemValidator {
    constructor(rule) {

        /**
         * Collection of available rules
         */
        this.rulesCollection = require('./rulesCollection');
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
     * Check if concrete value is matched to rule
     */
    isValid(value) {
        let valid = true;
        if (this.rule.required) {
            valid = this.rulesCollection.get('required')(value);
            this.error = `Value is required`;
        } else if (value === undefined || value === null) {
            //value not exists and is not required, ok
            return true;
        }
        if (valid && this.format) {
            valid = this.rulesCollection.get(this.rule.type)(value, this.format);
            this.error = `Value: ${value} does not match format ${this.format}`
        }
        return valid;
    }
    getRulesCollection() {
        return this.rulesCollection;
    }
}

module.exports = ItemValidator;