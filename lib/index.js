function errorMessage(fieldName, value, validation, label, defaultMessage) {
  const message = validation.message || defaultMessage;
  const interpolatedMessage = message.replace('{' + fieldName + '}', label); 
  return {message: interpolatedMessage};
}

function validateRequired(fieldName, value, validation, label) {
  if (value) return false;
  return errorMessage(fieldName, value, validation, label, '{' + fieldName + '} bitte angeben'); 
}

function validateMinItems(fieldName, value, validation, label) {

  if (!(value instanceof Array)) {
    throw new Error(`value for ${fieldName} must be instance of Array`);
  }
  if (value.length < validation.minItems) {
    return errorMessage(fieldName, value, validation, label, '{' + fieldName + '} muß mindestens ' + validation.minItems + ' Einträge enthalten'); 
  } 

}

function validateEmail(fieldName, value, validation, label) {
  const re = /^(([^<>()\[\]\\. :\s@"]+(\.[^<>()\[\]\\.:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
  if (value && re.test(value)) {
    return false; 
  } 
  return errorMessage(fieldName, value, validation, label, '{' + fieldName + '} ist keine gültige E-Mail-Adresse'); 
}

function validateSize(fieldName, value, validation, label) {
  
  // don't validate when there is no value
  if (!value) return false; 

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

function validate(fieldName, form, validations, promises) {
 
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

    if (validationRule.execAsync) {
      promises.push(
        validationRule.execAsync(
          fieldName, value, validationRule, label, validations, form
        )
      );
    }


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
    } else if (validationRule.execCustom) {
      const result = validationRule.execCustom(
        fieldName, value, validationRule, label, validations, form
      );
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
    } else if (validationRule.minItems) {
      const result = 
        validateMinItems(fieldName, value, validationRule, label);
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

function formValidator (form, validations, callback) {


  let error = null;
  const promises = [];
  const mainErrorMessage = 'Bitte überprüfen Sie Ihre Angaben';

  for (let name in validations) {
    const validationResult = validate(name, form, validations, promises);

    if (validationResult) {
      if (!error) error = {};
      error.message = mainErrorMessage;
      if (!error.errors) {
        error.errors = {}; 
      }
      error.errors[name] = validationResult;
    } 
  } 

  //console.log('promises', promises);


  if (promises.length) {
    Promise.all(promises).then((errorResults) => {
      if (errorResults.length) {
        for (let i = 0, l = errorResults.length; i < l; i ++) {
          let errorResult = errorResults[i];  
          if (errorResult) { 
            if (!error) error = {};
            error.message = mainErrorMessage;
            if (!error.errors) {
              error.errors = {}; 
            }
            // theres only one key, which is
            // the key of the object
            for (let key in errorResult) {
              error.errors[key] = errorResult[key]; 
            } 
          }
        } 
      }
      callback(error);
    }).catch((err) => {
      console.log(err);
      callback({error: err});
    });
  } else {
    if (callback) {
      callback(error);
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
