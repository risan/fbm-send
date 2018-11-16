/* global test:false, expect:false */;
const messagingTypes = require("../src/messaging-types");

test("it has all supported messaging types", () => {
  expect(messagingTypes).toHaveProperty("RESPONSE", "RESPONSE");
  expect(messagingTypes).toHaveProperty("UPDATE", "UPDATE");
  expect(messagingTypes).toHaveProperty("MESSAGE_TAG", "MESSAGE_TAG");
});
