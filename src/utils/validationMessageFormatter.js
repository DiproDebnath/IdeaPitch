
module.exports = (validationMessageArray) => {
  return validationMessageArray.reduce((obj, item) => {
    obj[item.path[0]] = item.message.replace( /"/g, '');
    return obj;
  }, {});
};
