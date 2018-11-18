/* global test:false, expect:false */
const senderActions = require("../src/sender-actions");

test("it has all supported sender actions", () => {
  expect(senderActions).toHaveProperty("MARK_SEEN", "mark_seen");
  expect(senderActions).toHaveProperty("TYPING_ON", "typing_on");
  expect(senderActions).toHaveProperty("TYPING_OFF", "typing_off");
});
