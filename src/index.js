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
   * Send image.
   *
   * @param {String|stream.Readable} file
   * @param {Object} options
   * @return {Object}
   */
  async image(file, options) {
    return this.attachment(file, { ...options, type: "image" });
  }

  /**
   * Send video.
   *
   * @param {String|stream.Readable} file
   * @param {Object} options
   * @return {Object}
   */
  async video(file, options) {
    return this.attachment(file, { ...options, type: "video" });
  }

  /**
   * Send audio.
   *
   * @param {String|stream.Readable} file
   * @param {Object} options
   * @return {Object}
   */
  async audio(file, options) {
    return this.attachment(file, { ...options, type: "audio" });
  }

  /**
   * Send attachment.
   *
   * @param {String|stream.Readable} file
   * @param {String} options.type
   * @param {Boolean} options.isReusable
   * @param {String|Object} options.to
   * @param {String} options.messagingType
   * @return {Object}
   */
  async attachment(
    file,
    { type = "file", isReusable = false, to, messagingType = RESPONSE }
  ) {
    const options = {
      recipient: to,
      messaging_type: messagingType,
      message: {
        attachment: {
          type,
          payload: {
            is_reusable: isReusable
          }
        }
      }
    };

    if (typeof file === "string") {
      options.message.attachment.payload.url = file;
    } else {
      options.filedata = file;
      options.formData = true;
    }

    return this.request(options);
  }

  /**
   * Send attachment id.
   *
   * @param {String} id
   * @param {String} options.type
   * @param {String|Object} options.to
   * @param {String} options.messagingType
   * @return {Object}
   */
  async attachmentId(id, { type = "file", to, messagingType = RESPONSE }) {
    return this.request({
      recipient: to,
      messaging_type: messagingType,
      message: {
        attachment: {
          type,
          payload: {
            attachment_id: id
          }
        }
      }
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
