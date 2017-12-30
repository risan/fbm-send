const axios = require('axios');

export default class MessengerClient {
  static get DEFAULT_API_VERSION() {
    return '2.11';
  }

  static get MESSAGING_TYPE_RESPONSE() {
    return 'RESPONSE';
  }

  static get MESSAGING_TYPE_UPDATE() {
    return 'UPDATE';
  }

  static get MESSAGING_TYPE_MESSAGE_TAG() {
    return 'MESSAGE_TAG';
  }

  static get MESSAGING_TYPE_NON_PROMOTIONAL_SUBSCRIPTION() {
    return 'NON_PROMOTIONAL_SUBSCRIPTION';
  }

  constructor({
    pageAccessToken,
    apiVersion = MessengerClient.DEFAULT_API_VERSION
  } = {}) {
    if (!pageAccessToken) {
      throw new Error('The pageAccessToken parameter is required.');
    }

    this.pageAccessToken = pageAccessToken;
    this.apiVersion = apiVersion;
    this.uri = `https://graph.facebook.com/v${this.apiVersion}/me/messages`;
  }

  sendText({
    recipientId,
    text,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendMessage({
      recipientId,
      message: { text },
      messagingType
    });
  }

  sendImage({
    recipientId,
    url,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendAttachmentFromUrl({
      recipientId,
      url,
      type: 'image',
      messagingType
    });
  }

  sendAudio({
    recipientId,
    url,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendAttachmentFromUrl({
      recipientId,
      url,
      type: 'audio',
      messagingType
    });
  }

  sendVideo({
    recipientId,
    url,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendAttachmentFromUrl({
      recipientId,
      url,
      type: 'video',
      messagingType
    });
  }

  sendFile({
    recipientId,
    url,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendAttachmentFromUrl({
      recipientId,
      url,
      type: 'file',
      messagingType
    });
  }

  sendQuickReplies({
    recipientId,
    text,
    replies,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendMessage({
      recipientId,
      message: {
        text,
        quick_replies: replies
      },
      messagingType
    });
  }

  sendButtons({
    recipientId,
    text,
    buttons,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendTemplate({
      recipientId,
      type: 'button',
      payload: {
        text,
        buttons
      },
      messagingType
    });
  }

  sendGeneric({
    recipientId,
    elements,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendTemplate({
      recipientId,
      type: 'generic',
      payload: {
        elements
      },
      messagingType
    });
  }

  sendList({
    recipientId,
    elements,
    topElementStyle = null,
    button = null,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    const payload = { elements };

    if (topElementStyle) {
      payload.top_element_style = topElementStyle;
    }

    if (button) {
      payload.buttons = [button];
    }

    return this.sendTemplate({
      recipientId,
      type: 'list',
      payload,
      messagingType
    });
  }

  sendOpenGraphTemplate(
    recipientId,
    elements,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  ) {
    return this.sendTemplate(
      recipientId,
      {
        template_type: 'open_graph',
        elements
      },
      messagingType
    );
  }

  sendReceiptTemplate(
    recipientId,
    payload,
    elements,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  ) {
    return this.sendTemplate(
      recipientId,
      {
        ...payload,
        template_type: 'receipt',
        elements
      },
      messagingType
    );
  }

  sendMediaTemplate(
    recipientId,
    elements,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  ) {
    return this.sendTemplate(
      recipientId,
      {
        template_type: 'media',
        elements
      },
      messagingType
    );
  }

  sendReadReceipt(
    recipientId,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  ) {
    return this.sendAction(recipientId, 'mark_seen', messagingType);
  }

  sendTypingOn(
    recipientId,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  ) {
    return this.sendAction(recipientId, 'typing_on', messagingType);
  }

  sendTypingOff(
    recipientId,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  ) {
    return this.sendAction(recipientId, 'typing_off', messagingType);
  }

  sendAction(
    recipientId,
    action,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  ) {
    return this.send({
      messaging_type: messagingType,
      recipient: {
        id: recipientId
      },
      sender_action: action
    });
  }

  sendTemplate({
    recipientId,
    type,
    payload,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendAttachment({
      recipientId,
      attachment: {
        type: 'template',
        payload: {
          template_type: type,
          ...payload
        }
      },
      messagingType
    });
  }

  sendAttachmentFromUrl({
    recipientId,
    url,
    type = 'file',
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendAttachment({
      recipientId,
      attachment: { type, payload: { url } },
      messagingType
    });
  }

  sendAttachment({
    recipientId,
    attachment,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.sendMessage({
      recipientId,
      message: { attachment },
      messagingType
    });
  }

  sendMessage({
    recipientId,
    message,
    messagingType = MessengerClient.MESSAGING_TYPE_RESPONSE
  }) {
    return this.send({
      messaging_type: messagingType,
      recipient: {
        id: recipientId
      },
      message
    });
  }

  send(data) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.uri, data, this.getRequestConfig())
        .then(response => resolve(response.data))
        .catch(error => reject(MessengerClient.castToError(error)));
    });
  }

  getRequestConfig() {
    return {
      headers: {
        Authorization: `Bearer ${this.pageAccessToken}`
      }
    };
  }

  static castToError(error) {
    if (error.response) {
      const { message, type, code } = error.response.data.error;

      return new Error(
        `Failed calling send API: [${code}][${type}] ${message}`
      );
    }

    if (error.request) {
      return new Error('Failed calling send API, no response was received.');
    }

    return error;
  }
}
