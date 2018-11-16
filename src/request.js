const got = require("got");
const toFormData = require("./to-form-data");

/**
 * Send HTTP request.
 *
 * @param {String} options.accessToken
 * @param {Object} options.body
 * @param {String} options.version
 * @param {Boolean} options.formData
 * @return {Object}
 */
const request = async ({
  accessToken,
  body,
  version = "3.2",
  formData = false
}) => {
  const url = `https://graph.facebook.com/v${version}/me/messages`;

  const response = await got.post(url, {
    query: {
      access_token: accessToken
    },
    json: !formData,
    body: formData ? toFormData(body) : body
  });

  return response.body;
};

module.exports = request;
