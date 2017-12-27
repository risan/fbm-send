import MessengerClient from '../src';

const PAGE_ACCESS_TOKEN = 'foo';
const DEFAULT_API_VERSION = '2.11';
const URI = `https://graph.facebook.com/v${DEFAULT_API_VERSION}/me/messages`;

const messengerClient = new MessengerClient({
  pageAccessToken: PAGE_ACCESS_TOKEN
});

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
  expect(messengerClient.pageAccessToken).toBe(PAGE_ACCESS_TOKEN);
});

test('can get default apiVersion', () => {
  expect(messengerClient.apiVersion).toBe(MessengerClient.DEFAULT_API_VERSION);
});

test('can set custom apiVersion', () => {
  const messengerClient = new MessengerClient({
    pageAccessToken: PAGE_ACCESS_TOKEN,
    apiVersion: 'foo'
  });
  expect(messengerClient.apiVersion).toBe('foo');
});

test('can get URI property', () => {
  expect(messengerClient.uri).toBe(URI);
});

test('can get request config', () => {
  expect(messengerClient.getRequestConfig()).toEqual({
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

test('can cast error request to error object', () => {
  expect(MessengerClient.castToError({ request: true })).toEqual(
    new Error('Failed calling send API, no response was received.')
  );
});

test('it wont cast non-request error', () => {
  const error = new Error('foo bar');

  expect(MessengerClient.castToError(error)).toEqual(error);
});
