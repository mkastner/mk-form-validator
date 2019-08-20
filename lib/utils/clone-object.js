function cloneObject(obj, clos) {
 
  let result;

  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      result = [];
      for (let i = 0, l = obj.length; i < l; i++) {
        const clonedObject = cloneObject(obj[i], clos); 
        result.push(clonedObject);
      }
    } else {
      result = {};
      for (let key in obj) {
        if (clos) clos(key);
        let item = obj[key];
        const clonedObject = cloneObject(item, clos);
        result[key] = clonedObject; 
      }   
    }
  } else {
    if (clos) clos(obj);
    result = obj;
  }

  return result;

}

module.exports = cloneObject;

