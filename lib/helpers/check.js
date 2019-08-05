module.exports = function Check(validations) {

  function required (fieldName) {
    const fieldValidation = validations[fieldName];
    if (!fieldValidation) return false; 
    const rules = fieldValidation.rules;
    if (!rules) return false;
    for (let i = 0, l = rules.length; i < l; i++) {
      let rule = rules[i];
      if (rule.required) return true; 
    }
  }

  return {
    required,
    optional(fieldName) { return !required(fieldName); }
  };

};
