/* global jest:false, beforeEach:false, test:false, expect:false */
const sendRequest = require("send-request");
const request = require("../src/request");
const toFormData = require("../src/to-form-data");

jest.mock("send-request");
jest.mock("../src/to-form-data");

beforeEach(() => {
  sendRequest.mockResolvedValue({ body: "bar" });
});

const defaultOptions = { accessToken: "secret", body: "foo" };

test("it can send request to Facebook API", async () => {
  const data = await request(defaultOptions);

  expect(data).toBe("bar");
  expect(sendRequest).toHaveBeenCalledTimes(1);
  expect(sendRequest).toHaveBeenCalledWith(
    "https://graph.facebook.com/v3.2/me/messages?access_token=secret",
    {
      json: true,
      body: "foo"
    }
  );
});

test("it can receive API version argument", async () => {
  await request({ ...defaultOptions, version: "2.7" });

  expect(sendRequest.mock.calls[0][0]).toBe(
    "https://graph.facebook.com/v2.7/me/messages?access_token=secret"
  );
});

test("it can receive form-data", async () => {
  const body = { foo: "bar" };

  toFormData.mockReturnValue("form-data");
  sendRequest.mockResolvedValue({ body: JSON.stringify(body) });

  const result = await request({ ...defaultOptions, formData: true });

  const secondArgs = sendRequest.mock.calls[0][1];

  expect(toFormData).toHaveBeenCalledWith("foo");
  expect(secondArgs).toHaveProperty("json", false);
  expect(secondArgs).toHaveProperty("body", "form-data");
  expect(result).toEqual(body);
});
