/* global jest:false, beforeEach:false, test:false, expect:false */
const fs = require("fs");
const FbmSend = require("../src");
const request = require("../src/request");
const { RESPONSE, UPDATE } = require("../src/messaging-types");
const { MARK_SEEN, TYPING_ON, TYPING_OFF } = require("../src/sender-actions");

jest.mock("fs");
jest.mock("../src/request");

let fbmSend = null;

beforeEach(() => {
  fbmSend = new FbmSend({ accessToken: "secret", version: "4.0" });

  request.mockResolvedValue("foo");
});

const getRequestArgs = () => request.mock.calls[0][0];

const requestOptions = {
  to: "123",
  messagingType: UPDATE
};

const requestArgs = {
  recipient: "123",
  messaging_type: UPDATE
};

const mockFbmRequest = () => {
  const mock = jest.fn();

  mock.mockResolvedValue("foo");

  return mock;
};

test("it can be initiated with default options", () => {
  process.env.FB_PAGE_ACCESS_TOKEN = "secret";

  const client = new FbmSend();

  expect(client.accessToken).toBe(process.env.FB_PAGE_ACCESS_TOKEN);
  expect(client.version).toBe("4.0");
});

test("it can be initiated with custom accessToken and version", () => {
  const client = new FbmSend({ accessToken: "foo", version: "123" });

  expect(client.accessToken).toBe("foo");
  expect(client.version).toBe("123");
});

test("it can send request", async () => {
  const response = await fbmSend.request({
    recipient: "123",
    message: true,
    messaging_type: RESPONSE
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
    version: "4.0",
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

test("it can send request with formData", async () => {
  await fbmSend.request({
    recipient: "123",
    formData: true
  });

  expect(getRequestArgs().formData).toBe(true);
});

test("it can send text", async () => {
  fbmSend.request = mockFbmRequest();

  const response = await fbmSend.text("foo bar", requestOptions);

  expect(response).toBe("foo");

  expect(fbmSend.request).toHaveBeenCalledWith({
    ...requestArgs,
    message: {
      text: "foo bar"
    }
  });
});

test("it can send attachment url", async () => {
  fbmSend.request = mockFbmRequest();

  await fbmSend.attachment("https://example.com", {
    ...requestOptions,
    type: "image",
    isReusable: true
  });

  expect(fbmSend.request).toHaveBeenCalledWith({
    ...requestArgs,
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "https://example.com",
          is_reusable: true
        }
      }
    }
  });
});

test("it can send attachment file", async () => {
  fbmSend.request = mockFbmRequest();

  fs.createReadStream = jest.fn();
  fs.createReadStream.mockReturnValue("readable-stream");

  await fbmSend.attachment("test.txt", {
    ...requestOptions,
    type: "file",
    isReusable: false
  });

  expect(fs.createReadStream).toHaveBeenCalledWith("test.txt");

  expect(fbmSend.request).toHaveBeenCalledWith({
    ...requestArgs,
    formData: true,
    filedata: "readable-stream",
    message: {
      attachment: {
        type: "file",
        payload: {
          is_reusable: false
        }
      }
    }
  });
});

test("it can send attachment id", async () => {
  fbmSend.request = mockFbmRequest();

  await fbmSend.attachmentId("1234", {
    ...requestOptions,
    type: "video"
  });

  expect(fbmSend.request).toHaveBeenCalledWith({
    ...requestArgs,
    message: {
      attachment: {
        type: "video",
        payload: {
          attachment_id: "1234"
        }
      }
    }
  });
});

test("it can send image", async () => {
  fbmSend.attachment = jest.fn();

  await fbmSend.image("https://example.com", requestOptions);

  expect(fbmSend.attachment).toHaveBeenCalledWith("https://example.com", {
    ...requestOptions,
    type: "image"
  });
});

test("it can send video", async () => {
  fbmSend.attachment = jest.fn();

  await fbmSend.video("https://example.com", requestOptions);

  expect(fbmSend.attachment).toHaveBeenCalledWith("https://example.com", {
    ...requestOptions,
    type: "video"
  });
});

test("it can send audio", async () => {
  fbmSend.attachment = jest.fn();

  await fbmSend.audio("https://example.com", requestOptions);

  expect(fbmSend.attachment).toHaveBeenCalledWith("https://example.com", {
    ...requestOptions,
    type: "audio"
  });
});

test("it can send action", async () => {
  fbmSend.request = mockFbmRequest();

  await fbmSend.action("mark_seen", {
    to: "123"
  });

  expect(fbmSend.request).toHaveBeenCalledWith({
    recipient: "123",
    sender_action: "mark_seen"
  });
});

test("it can send mark seen action", async () => {
  fbmSend.action = jest.fn();

  await fbmSend.markSeen({ to: "123" });

  expect(fbmSend.action).toHaveBeenCalledWith(MARK_SEEN, {
    to: "123"
  });
});

test("it can send typing on action", async () => {
  fbmSend.action = jest.fn();

  await fbmSend.typingOn({ to: "123" });

  expect(fbmSend.action).toHaveBeenCalledWith(TYPING_ON, {
    to: "123"
  });
});

test("it can send typing off action", async () => {
  fbmSend.action = jest.fn();

  await fbmSend.typingOff({ to: "123" });

  expect(fbmSend.action).toHaveBeenCalledWith(TYPING_OFF, {
    to: "123"
  });
});
