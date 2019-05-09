function errorMessage(fieldName, value, validation, defaultMessage) {
  let message = validation.message || defaultMessage;
  return message.replace('{' + fieldName + '}', validation.label);
}

function validateRequired(fieldName, value, validation) {
  if (value) return false;
  return errorMessage(fieldName, value, validation, '{' + fieldName + '} bitte angeben'); 
}


function validateCheckbox(fieldName, value, validation) {

  console.log(`validateCheckbox fieldName ${fieldName} value ${value}`);

  if (value && value.match(/1|yes|ja|true/)) { return false; }
  return errorMessage(fieldName, value, validation, '{' + fieldName + '} bitte ancklicken'); 
}

function validate(fieldName, value, fieldValidations) {

  let errors = [];
  
  for (let i = 0, l = fieldValidations.length; i < l; i++) {
 
    let fieldValidation = fieldValidations[i];

    console.log('fieldName', fieldName);
    console.log('fieldValidation.required', fieldValidation.required);

    if (fieldValidation.required) {
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
  console.log('here **************'); 

  let error = { errors: null };

  for (let name in validations) {
    
    console.log('here **************'); 
    let validationResult = validate(name, form[name], validations[name]);
    console.log('validationResult', validationResult);
    if (validationResult) {
      if (!error.errors) {
        error.errors = {}; 
        error.message = 'Bitte überprüfen Sie Ihre Eingaben';
      }
      error.errors[name] = validationResult;
    } 
  } 
 
  return error;

}

module.exports = formValidator;
