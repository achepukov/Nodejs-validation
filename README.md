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
{
  type: 'string' || 'number' || 'date' || 'email',
  required: true || false,
  format: 'dd-MM-yyyy' || 'dd-MM-yy' // for dates
  format: 'digitsBeforeComma:digitsAfterComma' // for numbers
  format: 'minLen:maxLen' // for strings
}

#FAQ

Q: May I add my own validation rules?
A: Not now, maybe in future version