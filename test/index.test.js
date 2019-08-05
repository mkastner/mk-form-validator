const tape = require('tape');
const formValidator = require('../lib/index');

tape('test validator', (t) => {

  
  const validation = { 
    firstName: {
      label: 'Vorname',
      rules: [
        {
          required: true,
        }
      ],
    },
    zip: {
      label: 'Postleitzahl',
      rules: [
        {
          size: 5,
        }
      ],
    }, 
    password: {
      label: 'Passwort',
      rules: [{
        required: true,
        message: 'Bitte geben Sie ein Passwort ein'
      } ],
    },
    passwordConfirmation: {
      label: 'Passwortbestätigung',
      rules: [{
        required: true,
      },{
        confirms: 'password',
        //message: 'Bitte wiederholen Sie die Eingabe des Passworts in diesem Feld',
      }],
    },
    privacy: {
      label: 'Datenschutz', 
      rules: [
        {
          checkbox: true,
          message: 'Bitte bestätigen Sie, daß Sie die Datenschutzangaben gelesen haben und diese akzeptieren'
        }
      ]
    } 
  };
  
  const formA = { 
    firstName: '',
    password: 'password'
  };

  const errorA = formValidator(formA, validation);

  console.log('errorA', errorA);

  t.ok(errorA.errors.firstName.message, 'error on first name');
  t.ok(errorA.errors.privacy.message, 'error on privacy');
  t.ok(errorA.errors.privacy.message.match(/Datenschutz/), 
    'uses custom message');
  t.ok(errorA.errors.passwordConfirmation.message, 'error on password confirmation');
  t.ok(errorA.errors.passwordConfirmation.message.match(/bitte angeben/), 'password confirmation missing');
 
  const formB = { 
    email: '',
    emailConfirmation: 'kastner@fmh.de',
    password: 'passwordB',
    passwordConfirmation: 'wrongConfirmationB',
  };
  const validationB = {
    email: {
      label: 'Email',
      rules: [{
        required: true,
      } ],
    },
    emailConfirmation: {
      label: 'E-Mail-Bestätigung',
      rules: [{
        required: true,
      },{
        confirms: 'email',
        //message: 'Bitte wiederholen Sie die Eingabe des Passworts in diesem Feld',
      }],
    },
    password: {
      label: 'Passwort',
      rules: [{
        required: true,
        message: 'Bitte geben Sie ein Passwort ein'
      } ],
    },
    passwordConfirmation: {
      label: 'Passwortbestätigung',
      rules: [{
        required: true,
      },{
        confirms: 'password',
        //message: 'Bitte wiederholen Sie die Eingabe des Passworts in diesem Feld',
      }],
    }
  };
  
  const errorB = formValidator(formB, validationB);

  t.ok(errorB.errors.emailConfirmation, 'error on email confirmation');

  t.ok(errorB.errors.passwordConfirmation, 'error on password confirmation');

  const formC = { 
    firstName: '',
    password: 'password',
    passwordConfirmation: 'password',
    privacy: true
  };

  const errorC = formValidator(formC, validation);

  t.ok(errorC.errors.firstName);
  // create error to have error object
  t.notOk(errorC.errors.passwordConfirmation, 'no error on password confirmation');

  t.end();

});

tape('test size', (t) => {
  
  const formA = { 
    zip: '333',
  };
  
  const formB = { 
    zip: '33333',
  };

  const validation = {
    zip: {
      label: 'ZIP',
      rules: [{
        required: true,
      }, {
        size: 5
      } ],
    },
  };
  
  const errorA = formValidator(formA, validation);
  t.ok(errorA.errors.zip, 'error on ZIP size');

  const errorB = formValidator(formB, validation);
  t.notOk(errorB, 'no error on ZIP size');

  t.end();

});
