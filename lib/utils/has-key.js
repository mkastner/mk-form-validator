module.exports = function hasKey(obj, key) {
  for (let foundKey in obj) {
    if (foundKey === key) {
      return true;
    }
  }
  return false;
};
