function errorMessage(fieldName, value, validation, defaultMessage) {
  let message = validation.message || defaultMessage;
  return message.replace('{' + fieldName + '}', validation.label);
}

function validateRequired(fieldName, value, validation) {
  if (value) return false;
  return errorMessage(fieldName, value, validation, '{' + fieldName + '} bitte angeben'); 
}


function validateCheckbox(fieldName, value, validation) {
  console.log(`validateCheckbox fieldName  ${fieldName} value ${value}`);
  console.log(`validateCheckbox validation ${JSON.stringify(validation)}`);
  let truthyRegExp = new RegExp(validation.checkbox); 
  if (value && (value + '').match(truthyRegExp)) { return false; }
  return errorMessage(fieldName, value, validation, '{' + fieldName + '} bitte anklicken'); 
}

function validate(fieldName, value, fieldValidations) {
  
  for (let i = 0, l = fieldValidations.length; i < l; i++) {
 
    let fieldValidation = fieldValidations[i];

    if (fieldValidation.checkbox && fieldValidation.required) {
      
      let result = validateCheckbox(fieldName, value, fieldValidation); 
      if (result) {
        return result; 
      }
    } else if (fieldValidation.required) {
      let result = validateRequired(fieldName, value, fieldValidation);
      console.log('result', result);
      if (result) {
        return result; 
      }
    } else if (fieldValidation.checkbox) {
      let result = validateCheckbox(fieldName, value, fieldValidation); 
      if (result) {
        return result; 
      }
    }
  }
}

function formValidator (form, validations) {

  let error = { errors: null };

  for (let name in validations) {
    let validationResult = validate(name, form[name], validations[name]);
    console.log('name            ', name); 
    console.log('validationResult', validationResult); 
    if (validationResult) {
      if (!error.errors) {
        error.errors = {}; 
        error.message = 'Bitte überprüfen Sie Ihre Eingaben';
      }
      error.errors[name] = validationResult;
    } 
  } 

  for (let key in error.errors) {
    console.log('error in', key); 
  }

  return error;

}

module.exports = formValidator;
