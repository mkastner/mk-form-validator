const tape = require('tape');
const formValidator = require('../lib/index');
const log = require('mk-log');

const listValidation = { 
  firstName: {
    label: 'Vorname',
    rules: [
      { required: true }
    ]
  },
  assets: {
    label: 'Dateiliste',
    rules: [
      { required: true },
      {
        list: { 
          fileName: {
            label: 'Datei', 
            rules: [ 
              { required: true }
            ]
          },
          copyright: {
            label: 'Rechteinhaber', 
            rules: [
              { required: true }
            ]
          }
        }
      }
    ] 
  }
};

tape('test without errors', (t) => {

  const form = {
    firstName: 'John',
    assets: [
      {
        fileName: 'test0.png',
        copyright: 'Some Photo Stock 0'
      },
      {
        fileName: 'test1.png',
        copyright: 'Some Photo Stock1'
      }
    ]
  };
  const error = formValidator(form, listValidation);

  log.debug('error', error);

  t.notOk(error, 'no errors should exist');

  t.end();

});

tape('test with list errors', (t) => {

  const form = {
    firstName: '',
    assets: [{
      fileName: 'asdas',
      copyright: 'Some Photo Stock0'
    }, {
      fileName: 'test1.png',
      copyright: ''
    }]
  };
  
  const error = formValidator(form, listValidation);

  log.debug('error', JSON.stringify(error, null, 2));

  t.ok(error, 'error should exist');

  t.end();

});

