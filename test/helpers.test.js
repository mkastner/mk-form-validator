const tape = require('tape');
const Check = require('../lib/helpers/check.js');

tape('test validator', (t) => {
  
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
  };
  
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
