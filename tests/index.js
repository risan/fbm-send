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
  const client = createMock('send');
  const text = MESSAGE;

  client.sendText({
    recipientId: RECIPIENT_ID,
    text
  });

  expect(client.send.mock.calls.length).toBe(1);
  expect(client.send.mock.calls[0][0]).toEqual({
    messaging_type: MessengerClient.MESSAGING_TYPE_RESPONSE,
    recipient: { id: RECIPIENT_ID },
    message: { text }
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
