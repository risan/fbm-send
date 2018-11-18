/* global expect:false, test:false */
const isUrl = require("../src/is-url");

test("it returns true if string started with http:// or https://", () => {
  expect(isUrl("http://example.com")).toBe(true);
  expect(isUrl("https://example.com")).toBe(true);

  expect(isUrl("test.txt")).toBe(false);
  expect(isUrl("./test.txt")).toBe(false);
  expect(isUrl("../../test.txt")).toBe(false);
});
