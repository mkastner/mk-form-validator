const cloneObject = require('../utils/clone-object');
const hasKey = require('../utils/has-key');
const extraKeys = ['message'];

function findRuleIndex(rules, ruleKey) {
  return rules.findIndex( r => hasKey(r, ruleKey) );
}

function checkRuleKey(key) {
  return extraKeys.indexOf(key) === -1; 
}

function completeExtraKeys(baseRule, extRule) {
  for (let i = 0, l = extraKeys.length; i < l; i++) {
    const extraKey = extraKeys[i]; 
    if (hasKey(baseRule, extraKey)) {
      baseRule[extraKey] = extRule[extraKey]; 
    } 
  } 
}


function completeRules(baseRules, extRules) {
  for (let i = 0, l = extRules.length; i < l; i++) {
    const extRule = extRules[i];
    for (let extRuleKey in extRule) {
      // looking for ruleKeys only
      const isRuleKey = checkRuleKey(extRuleKey);
      if (isRuleKey) {

        const foundBaseRuleIndex = 
          findRuleIndex(baseRules, extRuleKey);
        if (foundBaseRuleIndex === -1) {
          // add  
          baseRules.push(extRule);
        } else {
          // replace atomic
          // validation fields; e.g. required etc. 
          const baseRule = baseRules[foundBaseRuleIndex];
          baseRule[extRuleKey] = extRule[extRuleKey];
          // extra fields; e.g. required etc. 
          completeExtraKeys(baseRule, extRule);
          baseRules[foundBaseRuleIndex] = baseRule;
        }  
      }        
    }     
  }  
}

module.exports = function mergeValidations(base, extending) {

  const baseValidation = cloneObject(base);
  const extendingValidation = cloneObject(extending);

  for (let key in extendingValidation) {
    const extVal = extendingValidation[key];
    const baseVal = baseValidation[key];
    if (!baseVal) {
      baseValidation[key] = extVal;
    } else {
      for (let fieldKey in extVal) {
        if (fieldKey === 'rules') {
          if (!baseVal[fieldKey]) {
            baseVal[fieldKey] = [];
          }
          const baseRules = baseVal[fieldKey]; 
          const extRules = extVal[fieldKey]; 
          completeRules(baseRules, extRules);
          baseVal[fieldKey] = baseRules;
        } else {
          if (hasKey(extendingValidation, key)) {
            baseValidation[key] = extendingValidation[key]; 
          }
        }
      } 
    } 
  }
  return baseValidation;
};

