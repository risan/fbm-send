/* global jest:false, beforeEach:false, test:false, expect:false */
const FbmSend = require("../src");
const request = require("../src/request");
const { RESPONSE, UPDATE } = require("../src/messaging-types");

jest.mock("../src/request");

let fbmSend = null;

beforeEach(() => {
  fbmSend = new FbmSend({ accessToken: "secret", version: "3.2" });

  request.mockResolvedValue("foo");
});

const getRequestArgs = () => request.mock.calls[0][0];

const mockFbmRequest = () => {
  const mock = jest.fn();

  mock.mockResolvedValue("foo");

  return mock;
};

test("it can be initiated with default options", () => {
  process.env.FB_PAGE_ACCESS_TOKEN = "secret";

  const client = new FbmSend();

  expect(client.accessToken).toBe(process.env.FB_PAGE_ACCESS_TOKEN);
  expect(client.version).toBe("3.2");
});

test("it can be initiated with custom accessToken and version", () => {
  const client = new FbmSend({ accessToken: "foo", version: "123" });

  expect(client.accessToken).toBe("foo");
  expect(client.version).toBe("123");
});

test("it can send request", async () => {
  const response = await fbmSend.request({
    recipient: "123",
    message: true
  });

  expect(response).toBe("foo");

  expect(request).toHaveBeenCalledWith({
    accessToken: "secret",
    body: {
      message: true,
      recipient: {
        id: "123"
      },
      messaging_type: RESPONSE
    },
    version: "3.2",
    formData: false
  });
});

test("it won't alter recipient argument with object type", async () => {
  await fbmSend.request({
    recipient: {
      foo: "bar",
      baz: "qux"
    }
  });

  expect(getRequestArgs().body.recipient).toEqual({
    foo: "bar",
    baz: "qux"
  });
});

test("it can send request with custom messagingType and formData", async () => {
  await fbmSend.request({
    recipient: "123",
    messaging_type: UPDATE,
    formData: true
  });

  expect(getRequestArgs().body.messaging_type).toBe(UPDATE);
  expect(getRequestArgs().formData).toBe(true);
});

test("it can send text", async () => {
  fbmSend.request = mockFbmRequest();

  const response = await fbmSend.text("foo bar", {
    to: "123",
    messagingType: UPDATE
  });

  expect(response).toBe("foo");

  expect(fbmSend.request).toHaveBeenCalledWith({
    recipient: "123",
    messaging_type: UPDATE,
    message: {
      text: "foo bar"
    }
  });
});
