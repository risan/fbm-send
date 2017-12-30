import nock from 'nock';
import MessengerClient from '../src';

const PAGE_ACCESS_TOKEN = 'foo';
const DEFAULT_API_VERSION = '2.11';
const URI = `https://graph.facebook.com/v${DEFAULT_API_VERSION}/me/messages`;
const RECIPIENT_ID = 123;
const MESSAGE = 'foobar';

const client = new MessengerClient({
  pageAccessToken: PAGE_ACCESS_TOKEN
});

const createMock = method => {
  const client = new MessengerClient({ pageAccessToken: PAGE_ACCESS_TOKEN });
  client[method] = jest.fn();

  return client;
};

const SUCCESS_RESPONSE = { foo: 'bar' };

const createServer = ({
  data = {},
  statusCode = 200,
  response = SUCCESS_RESPONSE
} = {}) => {
  return nock(`https://graph.facebook.com/v${DEFAULT_API_VERSION}/me`, {
    reqheaders: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    }
  })
    .post('/messages', data)
    .reply(statusCode, response);
};

const createServerWithError = ({ data = {}, error }) => {
  return nock(`https://graph.facebook.com/v${DEFAULT_API_VERSION}/me`, {
    reqheaders: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    }
  })
    .post('/messages', data)
    .replyWithError(error);
};

test('can get default api version', () => {
  expect(MessengerClient.DEFAULT_API_VERSION).toBe(DEFAULT_API_VERSION);
});

test('can get messaging type for response', () => {
  expect(MessengerClient.MESSAGING_TYPE_RESPONSE).toBe('RESPONSE');
});

test('can get messaging type for update', () => {
  expect(MessengerClient.MESSAGING_TYPE_UPDATE).toBe('UPDATE');
});

test('can get messaging type for message tag', () => {
  expect(MessengerClient.MESSAGING_TYPE_MESSAGE_TAG).toBe('MESSAGE_TAG');
});

test('can get messaging type for non promotional subscription', () => {
  expect(MessengerClient.MESSAGING_TYPE_NON_PROMOTIONAL_SUBSCRIPTION).toBe(
    'NON_PROMOTIONAL_SUBSCRIPTION'
  );
});

test('throws error if pageAccessToken is not provided', () => {
  expect(() => new MessengerClient()).toThrow(
    'The pageAccessToken parameter is required.'
  );
});

test('can get pageAccessToken property', () => {
  expect(client.pageAccessToken).toBe(PAGE_ACCESS_TOKEN);
});

test('can get default apiVersion', () => {
  expect(client.apiVersion).toBe(MessengerClient.DEFAULT_API_VERSION);
});

test('can set custom apiVersion', () => {
  const client = new MessengerClient({
    pageAccessToken: PAGE_ACCESS_TOKEN,
    apiVersion: 'foo'
  });

  expect(client.apiVersion).toBe('foo');
});

test('can get URI property', () => {
  expect(client.uri).toBe(URI);
});

test('can send text', () => {
  const client = createMock('sendMessage');
  const text = MESSAGE;

  client.sendText({ recipientId: RECIPIENT_ID, text });

  expect(client.sendMessage.mock.calls.length).toBe(1);
  expect(client.sendMessage.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    message: { text },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send image', () => {
  const client = createMock('sendAttachmentFromUrl');
  const url = 'https://example.com';

  client.sendImage({ recipientId: RECIPIENT_ID, url });

  expect(client.sendAttachmentFromUrl.mock.calls.length).toBe(1);
  expect(client.sendAttachmentFromUrl.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    url,
    type: 'image',
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send audio', () => {
  const client = createMock('sendAttachmentFromUrl');
  const url = 'https://example.com';

  client.sendAudio({ recipientId: RECIPIENT_ID, url });

  expect(client.sendAttachmentFromUrl.mock.calls.length).toBe(1);
  expect(client.sendAttachmentFromUrl.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    url,
    type: 'audio',
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send video', () => {
  const client = createMock('sendAttachmentFromUrl');
  const url = 'https://example.com';

  client.sendVideo({ recipientId: RECIPIENT_ID, url });

  expect(client.sendAttachmentFromUrl.mock.calls.length).toBe(1);
  expect(client.sendAttachmentFromUrl.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    url,
    type: 'video',
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send file', () => {
  const client = createMock('sendAttachmentFromUrl');
  const url = 'https://example.com';

  client.sendFile({ recipientId: RECIPIENT_ID, url });

  expect(client.sendAttachmentFromUrl.mock.calls.length).toBe(1);
  expect(client.sendAttachmentFromUrl.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    url,
    type: 'file',
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send quick replies', () => {
  const client = createMock('sendMessage');
  const text = MESSAGE;
  const replies = [{ foo: 'bar' }];

  client.sendQuickReplies({
    recipientId: RECIPIENT_ID,
    text,
    replies
  });

  expect(client.sendMessage.mock.calls.length).toBe(1);
  expect(client.sendMessage.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    message: {
      text,
      quick_replies: replies
    },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send buttons', () => {
  const client = createMock('sendTemplate');
  const text = MESSAGE;
  const buttons = ['foo'];

  client.sendButtons({
    recipientId: RECIPIENT_ID,
    text,
    buttons
  });

  expect(client.sendTemplate.mock.calls.length).toBe(1);
  expect(client.sendTemplate.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    type: 'button',
    payload: { text, buttons },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send generic', () => {
  const client = createMock('sendTemplate');
  const elements = ['foo'];

  client.sendGeneric({
    recipientId: RECIPIENT_ID,
    elements
  });

  expect(client.sendTemplate.mock.calls.length).toBe(1);
  expect(client.sendTemplate.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    type: 'generic',
    payload: { elements },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send list', () => {
  const client = createMock('sendTemplate');
  const elements = ['foo'];
  const topElementStyle = 'bar';
  const button = { baz: 'qux' };

  client.sendList({
    recipientId: RECIPIENT_ID,
    elements,
    topElementStyle,
    button
  });

  expect(client.sendTemplate.mock.calls.length).toBe(1);
  expect(client.sendTemplate.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    type: 'list',
    payload: {
      elements,
      top_element_style: topElementStyle,
      buttons: [button]
    },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send media', () => {
  const client = createMock('sendTemplate');
  const type = 'image';
  const url = 'https://example.com';
  const button = { foo: 'bar' };

  client.sendMedia({
    recipientId: RECIPIENT_ID,
    type,
    url,
    button
  });

  expect(client.sendTemplate.mock.calls.length).toBe(1);
  expect(client.sendTemplate.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    type: 'media',
    payload: {
      elements: [
        {
          media_type: type,
          buttons: [button],
          url
        }
      ]
    },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send open graph', () => {
  const client = createMock('sendTemplate');
  const url = 'https://example.com';
  const buttons = ['foo'];

  client.sendOpenGraph({
    recipientId: RECIPIENT_ID,
    url,
    buttons
  });

  expect(client.sendTemplate.mock.calls.length).toBe(1);
  expect(client.sendTemplate.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    type: 'open_graph',
    payload: {
      elements: [
        {
          url,
          buttons
        }
      ]
    },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send receipt', () => {
  const client = createMock('sendTemplate');

  client.sendReceipt({
    recipientId: RECIPIENT_ID,
    recipientName: 'John Doe',
    orderNumber: '12345',
    paymentMethod: 'Visa',
    summary: {
      total_cost: 100
    },
    currency: 'USD',
    sharable: true,
    merchantName: 'The Empire',
    timestamp: '12345',
    elements: ['foo'],
    address: { foo: 'bar' },
    adjustments: ['foo']
  });

  expect(client.sendTemplate.mock.calls.length).toBe(1);
  expect(client.sendTemplate.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    type: 'receipt',
    payload: {
      recipient_name: 'John Doe',
      order_number: '12345',
      payment_method: 'Visa',
      summary: {
        total_cost: 100
      },
      currency: 'USD',
      sharable: true,
      merchant_name: 'The Empire',
      timestamp: '12345',
      elements: ['foo'],
      address: { foo: 'bar' },
      adjustments: ['foo']
    },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send template', () => {
  const client = createMock('sendAttachment');
  const url = 'https://example.com';

  client.sendTemplate({
    recipientId: RECIPIENT_ID,
    type: 'foo',
    payload: {
      text: 'bar',
      buttons: ['baz']
    }
  });

  expect(client.sendAttachment.mock.calls.length).toBe(1);
  expect(client.sendAttachment.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    attachment: {
      type: 'template',
      payload: {
        template_type: 'foo',
        text: 'bar',
        buttons: ['baz']
      }
    },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send attachment from url', () => {
  const client = createMock('sendAttachment');
  const url = 'https://example.com';

  client.sendAttachmentFromUrl({ recipientId: RECIPIENT_ID, url });

  expect(client.sendAttachment.mock.calls.length).toBe(1);
  expect(client.sendAttachment.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    attachment: { type: 'file', payload: { url } },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send attachment', () => {
  const client = createMock('sendMessage');
  const attachment = { foo: 'bar' };

  client.sendAttachment({ recipientId: RECIPIENT_ID, attachment });

  expect(client.sendMessage.mock.calls.length).toBe(1);
  expect(client.sendMessage.mock.calls[0][0]).toEqual({
    recipientId: RECIPIENT_ID,
    message: { attachment },
    messagingType: MessengerClient.MESSAGING_TYPE_RESPONSE
  });
});

test('can send message', () => {
  const client = createMock('send');
  const message = { text: MESSAGE };

  client.sendMessage({ recipientId: RECIPIENT_ID, message });

  expect(client.send.mock.calls.length).toBe(1);
  expect(client.send.mock.calls[0][0]).toEqual({
    messaging_type: MessengerClient.MESSAGING_TYPE_RESPONSE,
    recipient: {
      id: RECIPIENT_ID
    },
    message
  });
});

test('can send request to messenger send API', () => {
  const data = { foo: 'bar' };
  const server = createServer({ data });

  expect.assertions(1);

  return expect(client.send(data)).resolves.toEqual(SUCCESS_RESPONSE);
});

test('throws error when API returns bad request response', () => {
  const data = { foo: 'bar' };
  const server = createServer({
    data,
    statusCode: 400,
    response: {
      error: {
        code: 123,
        type: 'foo',
        message: 'bar'
      }
    }
  });

  expect.assertions(1);

  return expect(client.send(data)).rejects.toEqual(
    new Error('Failed calling send API: [123][foo] bar')
  );
});

test('can get request config', () => {
  expect(client.getRequestConfig()).toEqual({
    headers: {
      Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
    }
  });
});

test('can cast error response to error object', () => {
  expect(
    MessengerClient.castToError({
      response: {
        data: {
          error: {
            code: 123,
            type: 'foo',
            message: 'bar'
          }
        }
      }
    })
  ).toEqual(new Error('Failed calling send API: [123][foo] bar'));
});

test('throws error when API returns no response', () => {
  const data = { foo: 'bar' };
  const server = createServerWithError({
    data,
    error: {
      request: 'foo bar'
    }
  });

  expect.assertions(1);

  return expect(client.send(data)).rejects.toEqual(
    new Error('Failed calling send API, no response was received.')
  );
});

test('can cast error request to error object', () => {
  expect(MessengerClient.castToError({ request: true })).toEqual(
    new Error('Failed calling send API, no response was received.')
  );
});

test('it wont cast non-request error', () => {
  const error = new Error('foo bar');

  expect(MessengerClient.castToError(error)).toEqual(error);
});
