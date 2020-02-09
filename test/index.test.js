const tape = require('tape');
const formValidator = require('../lib/index');
const log = require('mk-log');

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

  log.debug('errorA', errorA);

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

tape('test minItems', (t) => {
  
  const formA = { 
    phones: [],
  };
  
  const formB = { 
    phones: ['33333']
  };

  const validation = {
    phones: {
      label: 'Phone Numbers',
      rules: [{
        required: true,
      }, {
        minItems: 1 
      } ],
    }
  };
  
  const errorA = formValidator(formA, validation);

  log.debug(errorA);

  t.ok(errorA.errors.phones, 'error on minItems length');

  const errorB = formValidator(formB, validation);
  t.notOk(errorB, 'success on minItems size');

  t.end();

});

tape('test custom validation', (t) => {

  const form = {
    name: 'test',
    publishingContract: 'multiple',
    publishingHouses: ['one', '']
  };
  
  function customValidate(fieldName, value, validationRule, label, validation, form) {
    if (form.publishingContract === 'multiple') {
      let countCompleted = 0; 
      for (let i = 0, l = form.publishingHouses.length; i < l; i++) {
        if (form.publishingHouses[i]) {
          countCompleted += 1;
        } 
      }
      if (countCompleted < 2) {
        return {message: 'Mindestens zwei Redaktionen sind anzugeben'}; 
      }
    } else if (form.publishingContract === 'exclusive') {
      return {message: 'Bitte Name der Redaktion angeben'}; 
    }
  }

  const validation = {
    name: {
      label: 'Name',
      rules: [{required: true}]
    },
    publisher: {
      label: 'Publisher', 
      rules: [
        { 
          execCustom: customValidate
        }
      ] 
    }
  };

  const error = formValidator(form, validation);    
  log.info('error       ', error);
  log.info('error.errors', error.errors);
  
  t.ok(error.errors.publisher, 'async errors on publisher');
  t.end();


});


tape('test async validation', (t) => {

  const form = {
    name: 'test',
    street: ''
  };

  const validation = {
    street: {
      label: 'Strasse',
      rules: [{required: true}]
    },
    name: {
      label: 'Name', 
      rules: [
        { 
          execAsync(fieldName) {
            return new Promise((resolve) => {
              setTimeout(() => {
                const result = {};
                result[fieldName] = { message: 'this is an error message' };
                resolve(result);
              }, 1000); 
            });  
          }
        } 
      ] 
    }
  };

  formValidator(form, validation, (error) => {
    
    log.debug('error       ', error);
    log.debug('error.errors', error.errors);

    t.ok(error.errors.name, 'async errors on name');
    t.end();

    //process.exit(0);

  });


});
