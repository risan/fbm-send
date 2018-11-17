/* global jest:false, beforeEach:false, test:false, expect:false */
const got = require("got");
const request = require("../src/request");
const toFormData = require("../src/to-form-data");

jest.mock("got");
jest.mock("../src/to-form-data");

beforeEach(() => {
  got.post.mockResolvedValue({ body: "bar" });
});

const defaultOptions = { accessToken: "secret", body: "foo" };

test("it can send request to Facebook API", async () => {
  const data = await request(defaultOptions);

  expect(data).toBe("bar");
  expect(got.post).toHaveBeenCalledTimes(1);
  expect(got.post).toHaveBeenCalledWith(
    "https://graph.facebook.com/v3.2/me/messages",
    {
      json: true,
      body: "foo",
      query: {
        access_token: "secret"
      }
    }
  );
});

test("it can receive API version argument", async () => {
  await request({ ...defaultOptions, version: "2.7" });

  expect(got.post.mock.calls[0][0]).toBe(
    "https://graph.facebook.com/v2.7/me/messages"
  );
});

test("it can receive form-data", async () => {
  const body = { foo: "bar" };

  toFormData.mockReturnValue("form-data");
  got.post.mockResolvedValue({ body: JSON.stringify(body) });

  const result = await request({ ...defaultOptions, formData: true });

  const secondArgs = got.post.mock.calls[0][1];

  expect(toFormData).toHaveBeenCalledWith("foo");
  expect(secondArgs).toHaveProperty("json", false);
  expect(secondArgs).toHaveProperty("body", "form-data");
  expect(result).toEqual(body);
});
