const FormData = require("form-data");
const forIn = require("lodash/forIn");
const isPlainObject = require("lodash/isPlainObject");

/**
 * Convert objet to form data.
 *
 * @param {Object} obj
 * @return {FormData}
 */
const toFormData = obj => {
  const form = new FormData();

  forIn(obj, (value, key) =>
    form.append(key, isPlainObject(value) ? JSON.stringify(value) : value)
  );

  return form;
};

module.exports = toFormData;
