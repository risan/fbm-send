/* global jest:false, beforeEach:false, test:false, expect:false */
const stream = require("stream");
const FormData = require("form-data");
const toFormData = require("../src/to-form-data");

jest.mock("form-data");

const formDataMock = { append: jest.fn() };

beforeEach(() => {
  FormData.mockImplementation(() => formDataMock);
});

test("it returns FormData instance", () => {
  const formData = toFormData({});

  expect(formData).toBe(formDataMock);
});

test("it won't alter non-object properties", () => {
  const obj = { str: "bar", num: 17 };

  toFormData(obj);

  expect(formDataMock.append).toHaveBeenNthCalledWith(1, "str", "bar");
  expect(formDataMock.append).toHaveBeenCalledTimes(2, "num", 17);
});

test("it won't alter property with readable stream type", () => {
  const obj = { file: new stream.Readable() };

  toFormData(obj);

  expect(formDataMock.append).toHaveBeenNthCalledWith(1, "file", obj.file);
});

test("it JSON stringify property with plain object type", () => {
  const obj = {
    person: { name: "john", age: 20 }
  };

  toFormData(obj);

  expect(formDataMock.append).toHaveBeenNthCalledWith(
    1,
    "person",
    JSON.stringify(obj.person)
  );
});
