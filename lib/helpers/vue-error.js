const hasKey = require('../utils/has-key.js');

module.exports = function VueError(errorContext) {
  // context is the object holding the error object
  // can be state in vuex or
  // data in vue component
 
  if (!hasKey(errorContext, 'error')) {
    throw new Error('errorContext must have an attribute key "error"');
  }

  function populate(validationError) {
    if (validationError) {
      errorContext.error = {};
      errorContext.error[ 'message']=  
        validationError.message || 'Bitte überprüfen Sie Ihre Eingaben';
      if (validationError.errors) {

        console.log('validationError', validationError);

        errorContext.error['errors'] = {};
        for (let key in validationError.errors) {
          errorContext.error.errors[key] = {};
          errorContext.error.errors[key][ 'message']= validationError.errors[key].message;
        } 
      }
    }
  }
  function clear() {
    if (!errorContext.error) {return this; }
    if (errorContext.error.message) {
      delete errorContext.error['message'];
      if (errorContext.error.errors) {
        for (let key in errorContext.error.errors) {
          if (errorContext.error.errors[key].message) {
            delete errorContext.error.errors[key]['message'];
          }
          delete errorContext.error.errors[key];
        } 
        delete errorContext.error['errors'];
      } 
    }
    errorContext.error = null;
    return this;
  }
  return {
    populate,
    clear
  };
};
