'use strict';
let _ = require('underscore');
let rulesCollection;

/**
 * Holder of collection of rules
 */
rulesCollection =  {
    rules: new Map(),

    get: function (name) {
        if (this.exists(name)) {
            return this.rules.get(name);
        }
        console.log(`No rule found by name: ${name}`);
    },
    add: function (name, callback) {
        if (this.rules.has(name)) {
            console.log(`Rule already exists in name: ${name}`)
        }
        this.rules.set(name, callback);
    },
    exists: function(name) {
        return this.rules.has(name);
    }
};

// add default set of rules

rulesCollection.add('date', (value, format) => {
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
});
rulesCollection.add('number', (value, format) => {
    if (value.indexOf(',') == -1) {
        return false;
    }
    let requiredAfter, requiredBefore, valueBeforeComma, valueAfterComma;
    [requiredBefore, requiredAfter] = format.split(":");
    [valueBeforeComma, valueAfterComma] = value.split(",");
    return valueBeforeComma.length == requiredBefore
        && valueAfterComma.length == requiredAfter;
});
rulesCollection.add('string', (value, format) => {
    let min, max;
    [min, max] = format.split(":");
    return value.length >= min && value.length <= max;
});

rulesCollection.add('email', (value) => {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
});

rulesCollection.add('required', (value) => {
    return !_.isNull(value) && !_.isUndefined(value) && value != '';
});

module.exports = rulesCollection;