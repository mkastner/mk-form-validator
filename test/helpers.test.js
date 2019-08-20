const tape = require('tape');
const Check = require('../lib/helpers/check.js');
const mergeValidations = require('../lib/helpers/merge-validations.js');
const log = require('mk-log');

const validation = { 
  firstName: {
    label: 'Vorname',
    rules: [
      {
        required: true,
      }
    ]
  },
  email: {
    label: 'Email',
    rules: [
      {
        required: false
      }
    ],
  },
  phoneNumbers: {
    label: 'Phone Numbers',
    rules: [
      {
        minItems: 1 
      }
    ],
  }
};

tape('test check', (t) => {

  // Check is helper whether field should be reqired in form 

  const resultA = Check(validation).required('firstName'); 
  t.ok(resultA, 'firstName is required');

  const resultB = Check(validation).required('email'); 
  t.notOk(resultB, 'email is not required');
  
  const resultC = Check(validation).required('firstName'); 
  t.ok(resultC, 'firstName is not optional');

  const resultD = Check(validation).required('email'); 
  t.notOk(resultD, 'email is optional');

  t.end();

});

tape('merge validations', (t) => {

  const extendingValidation = {
    firstName: {
      label: 'Vorname Ext',
      rules: [
        {
          required: false,
        },
        {
          size: 7
        }
      ]
    },
    email: {
      rules: [
        {
          required: true
        }
      ]
    },

    familyName: {
      label: 'Familienname',
      rules: [
        {
          required: true
        }
      ],
    }
  }; 
 
  const mergedResult = mergeValidations(validation, extendingValidation);  
  
  t.ok(mergedResult.firstName.rules[1].size, 'added rule for firstName');
 
  t.ok(mergedResult.email.rules[0].required === true, 'required should be changed to true');
  
  t.ok(mergedResult.familyName, 'validation for family name should have been added');

  log.debug('base         validation', JSON.stringify(validation, null, 2));
  log.debug('extending    validation', JSON.stringify(extendingValidation, null, 2));
  log.debug('mergedResult validation', JSON.stringify(mergedResult, null, 2));

  t.end();

  process.exit(0);

});
