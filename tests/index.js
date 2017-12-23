import MessengerClient from '../src';

test('throws error if pageAccessToken is not provided', () => {
  expect(() => new MessengerClient()).toThrow(
    'The pageAccessToken parameter is required.'
  );
});
