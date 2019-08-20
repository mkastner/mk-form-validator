const hasKey = require('../utils/has-key');

module.exports = function VueError(errorContext, Vue) {
  // context is the object holding the error object
  // can be state in vuex or
  // data in vue component
 
  if (!hasKey(errorContext, 'error')) {
    throw new Error('errorContext must have an attribute key "error"');
  }

  if (!Vue) {throw new Error('Vue must be provided'); }
  function populate(validationError) {
    if (validationError) {
      errorContext.error = {};
      Vue.set(errorContext.error, 
        'message', 
        validationError.message || 'Bitte überprüfen Sie Ihre Eingaben');
      if (validationError.errors) {

        console.log('validationError', validationError);


        Vue.set(errorContext.error, 'errors', {});
        for (let key in validationError.errors) {
          Vue.set(errorContext.error.errors, key, {});
          Vue.set(errorContext.error.errors[key],
            'message', validationError.errors[key].message);
        } 
      }
    }
  }
  function clear() {
    if (!errorContext.error) {return this; }
    if (errorContext.error.message) {
      Vue.delete(errorContext.error, 'message');
      if (errorContext.error.errors) {
        for (let key in errorContext.error.errors) {
          if (errorContext.error.errors[key].message) {
            Vue.delete(errorContext.error.errors[key], 'message');
          }
          Vue.delete(errorContext.error.errors, key);
        } 
        Vue.delete(errorContext.error, 'errors');
      } 
    }
    errorContext.error = null;
    //Vue.set(errorContext, 'error', null);
    return this;
  }
  return {
    populate,
    clear
  };
};
