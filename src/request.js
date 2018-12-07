const sendRequest = require("send-request");
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

  const response = await sendRequest(`${url}?access_token=${accessToken}`, {
    method: "POST",
    json: !formData,
    body: formData ? toFormData(body) : body
  });

  if (formData && typeof response.body === "string") {
    return JSON.parse(response.body);
  }

  return response.body;
};

module.exports = request;
