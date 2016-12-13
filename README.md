# One more validator
Validation rules may be specified in file, or passed as param.

#Usage
```
let validator = require('validator');
validator.readRulesFromFile('rules.json')
// or
validator.setRules({some: {required: true;}});
validator.isValid({some: ''}); //false
//let get errors
let errors = validator.getErrors();
```

#List of all available rules
```
{
  type: 'string' || 'number' || 'date' || 'email',
  required: true || false,
  format: 'dd-MM-yyyy' || 'dd-MM-yy' // for dates
  format: 'digitsBeforeComma:digitsAfterComma' // for numbers
  format: 'minLen:maxLen' // for strings
}
```
#version
Works fine with node version 6.9.x. May have issues with earlier releases.

#FAQ

Q: May I add my own validation rules?
A: No, but you can create pull request in https://github.com/achepukov/Nodejs-validation