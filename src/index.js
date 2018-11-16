const request = require("./request");
const { RESPONSE } = require("./messaging-types");

class FbmSend {
  /**
   * Create new FbmSend instance.
   *
   * @param {String} options.accessToken
   * @param {String} options.version
   */
  constructor({
    accessToken = process.env.FB_PAGE_ACCESS_TOKEN,
    version = "3.2"
  } = {}) {
    this.accessToken = accessToken;
    this.version = version;
  }

  /**
   * Send text.
   *
   * @param {String} text
   * @param {String|Object} options.to
   * @param {String} options.messagingType
   * @return {Object}
   */
  async text(text, { to, messagingType = RESPONSE }) {
    return this.request({
      recipient: to,
      messaging_type: messagingType,
      message: { text }
    });
  }

  /**
   * Send HTTP request.
   *
   * @param {String|Object} options.recipient
   * @param {String} options.messaging_type
   * @param {Boolean} options.formData
   * @param {Object} options.body
   * @return {Object}
   */
  async request({
    recipient,
    messaging_type = RESPONSE,
    formData = false,
    ...body
  }) {
    let recipientObj = recipient;

    if (typeof recipient !== "object") {
      recipientObj = { id: recipient };
    }

    return request({
      accessToken: this.accessToken,
      body: {
        ...body,
        recipient: recipientObj,
        messaging_type
      },
      version: this.version,
      formData
    });
  }
}

module.exports = FbmSend;
