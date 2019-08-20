const tape = require('tape');
const cloneObject = require('../lib/utils/clone-object.js');
const log = require('mk-log');

const originalObject = {
  name: 'MyName',
  names: [
    'Mike',
    { 
      moreNames: [
        'Herbert', 
        {'Heinz': { age: 17 } }
      ]
    }
  ],
  age: 12
};

tape('test clone object', (t) => {

  let count = 0;

  const clonedObject = cloneObject(originalObject, (item) => {
    console.log(item); 
    count++; 
  }, true);

  t.equals(count, 11, 'should count items traversed');
 
  const stringifiedOriginal = JSON.stringify(originalObject);
  const stringifiedClone = JSON.stringify(clonedObject);

  t.equals(stringifiedOriginal, stringifiedClone, 'original and clone shoud be equal');

  log.debug('clonedObject', clonedObject);

  t.end();

  process.exit(0);

});

