const FormData = require("form-data");
const isPlainObj = require("@risan/is-plain-obj");

/**
 * Convert objet to form data.
 *
 * @param {Object} obj
 * @return {FormData}
 */
const toFormData = obj => {
  const form = new FormData();

  Object.keys(obj).forEach(key =>
    form.append(key, isPlainObj(obj[key]) ? JSON.stringify(obj[key]) : obj[key])
  );

  return form;
};

module.exports = toFormData;
