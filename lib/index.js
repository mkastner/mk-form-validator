function errorMessage(fieldName, value, validation, label, defaultMessage) {
  const message = validation.message || defaultMessage;
  const interpolatedMessage = message.replace('{' + fieldName + '}', label); 
  return {message: interpolatedMessage};
}

function validateRequired(fieldName, value, validation, label) {
  if (value) return false;
  return errorMessage(fieldName, value, validation, label, '{' + fieldName + '} bitte angeben'); 
}

function validateEmail(fieldName, value, validation, label) {
  const re = /^(([^<>()\[\]\\. :\s@"]+(\.[^<>()\[\]\\.:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  if (value && re.test(value)) {
    return false; 
  } 
  return errorMessage(fieldName, value, validation, label, '{' + fieldName + '} ist keine gültige E-Mail-Adresse'); 
}

function validateSize(fieldName, value, validation, label) {

  if (String(value) && String(value).length === validation.size) {
    return false; 
  } 

  return errorMessage(fieldName, value, validation, label, '{' + fieldName + '} muß genau ' + validation.size + ' Zeichen umfassen' ); 
}

function validateConfirms(fieldName, value, validation, label, validations, form) {

  if (value 
    && form[validation.confirms] 
    && value === form[validation.confirms]) return false;

  return errorMessage(validation.confirms, value, validation, 
    validations[validation.confirms].label, 
    'Eingabe von {' + 
    validation.confirms + 
    '} stimmt nicht mit diesem Feld überein. '); 
}

function validateCheckbox(fieldName, value, validation, label) {
  let truthyRegExp = new RegExp(validation.checkbox); 
  if (value && (value + '').match(truthyRegExp)) { return false; }
  return errorMessage(fieldName, value, validation, label, '{' + fieldName + '} bitte anklicken'); 
}

function validate(fieldName, form, validations) {
 
  const value = form[fieldName];
  const label = validations[fieldName].label;
  const fieldValidations = validations[fieldName];

  if (!fieldValidations) {
    throw new Error(`Could not find validations for field ${fieldName}`);
  }
  
  if (!fieldValidations.rules) {
    throw new Error(`Could not find rules in validations for field ${fieldName}`);
  }

  for (let i = 0, l = fieldValidations.rules.length; i < l; i++) {
 
    let validationRule = fieldValidations.rules[i];

    console.log('validationRule', validationRule);

    if (validationRule.checkbox && validationRule.required) {
      
      const result = 
        validateCheckbox(fieldName, value, validationRule, label); 
      if (result) {
        return result; 
      }
    } else if (validationRule.required) {
      const result = 
        validateRequired(fieldName, value, validationRule, label);
      if (result) {
        return result; 
      }
    } else if (validationRule.email) {
      const result = 
        validateEmail(fieldName, value, validationRule, label);
      if (result) {
        return result; 
      }
    } else if (validationRule.size) {
      const result = 
        validateSize(fieldName, value, validationRule, label);
      if (result) {
        return result; 
      }
    } else if (validationRule.confirms) {
      const result = 
        validateConfirms(fieldName, value, validationRule, label, validations, form);
      if (result) {
        return result; 
      }
    } else if (validationRule.checkbox) {
      const result = 
        validateCheckbox(fieldName, value, validationRule, label); 
      if (result) {
        return result; 
      }
    }
  }
}

function formValidator (form, validations) {

  let error = null;

  for (let name in validations) {
    const validationResult = validate(name, form, validations);

    console.log('name            ', name); 
    console.log('validationResult', validationResult); 
    if (validationResult) {
      if (!error) error = {};
      if (!error.errors) {
        error.errors = {}; 
        error.message = 'Bitte überprüfen Sie Ihre Eingaben';
      }
      error.errors[name] = validationResult;
    } 
  } 

  /*
  for (let key in error.errors) {
    console.log('error in', key); 
  }
  */
  return error;

}

module.exports = formValidator;
