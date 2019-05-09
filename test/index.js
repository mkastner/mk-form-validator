let tape = require('tape');
let formValidator = require('../lib/index');

tape('test validator', (t) => {

  let form = { 
    firstName: ''
  };
  
  let validation = { 
    firstName: [
      {
        required: true,
        label: 'Vorname'
      },
    ],

    privacy: [
      {
        checkbox: true,
        label: 'Datenschutz',
        message: 'Bitte bestätigen Sie, daß Sie die Datenschutzangaben gelesen haben und diese akzeptieren'
      }
    ] 
  };

  let error = formValidator(form, validation);

  console.log('error', error);

  t.ok(error.errors.firstName.length, '1 error on first name');
  t.ok(error.errors.privacy.length, '1 error on privacy');
  t.ok(error.errors.privacy.match(/Datenschutz/), 'uses custom message');

  t.end();

});
