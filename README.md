# Facebook Messenger Send API Client

[![Build Status](https://badgen.net/travis/risan/fbm-send)](https://travis-ci.org/risan/fbm-send)
[![Test Covarage](https://badgen.net/codecov/c/github/risan/fbm-send)](https://codecov.io/gh/risan/fbm-send)
[![Greenkeeper](https://badges.greenkeeper.io/risan/fbm-send.svg)](https://greenkeeper.io)
[![Latest Version](https://badgen.net/npm/v/fbm-send)](https://www.npmjs.com/package/fbm-send)

Send message through Facebook Messenger Send API.

## Installation

```bash
$ npm install fbm-send
```

## Usage

Use the [`fbm-webhook`](https://github.com/risan/fbm-webhook) module for handling the Facebook Messenger [webhook events](https://developers.facebook.com/docs/messenger-platform/reference/webhook-events/).

```js
const FbmSend = require("fbm-send");
const fbmWebhook = require("fbm-webhook");

const webhook = fbmWebhook({
  path: "/webhook",
  appSecret: "Your Facebook App Secret",
  verifyToken: "Your Predefined Verify Token"
});

const fbmSend = new FbmSend({
  accessToken: "Your Page Access Token",
  version: "3.2"
});

// Listen to the message event.
webhook.on("message", async event => {
  // Reply with text.
  const response = await fbmSend.request({
    recipient: event.sender,
    messaging_type: "RESPONSE",
    message: {
      text: "Hello World!"
    }
  });

  console.log(response);
});

webhook.listen(3000, () => console.log("Server is running on port: 3000"));
```

* `accessToken`: Your Facebook page access token, default to `process.env.FB_PAGE_ACCESS_TOKEN`.
* `version`: The Facebook Graph API version, default to `3.2`.

You can use the `try...catch` block to catch the API error response:

```js
try {
  await fbmSend.request({
    recipient: event.sender,
    messaging_type: "RESPONSE",
    message: {
      text: "Hello World!"
    }
  });
} catch(error) {
  if (error.response) {
    console.log(error.response); // The API error response object.
  }
}
```

## API and Examples

### Table of Contents

* [Constructor](#constructor)
* [Send Request](#send-request)
* [Send Text](#send-text)
* [Send Attachment](#send-attachment)
* [Send Image/Video/Audio](#send-imagevideoaudio)
* [Send Saved Attachment](#send-saved-attachment)
* [Send Sender Action](#send-sender-action)
* [Send Mark Seen/Typing On/Typing Off](#send-mark-seentyping-ontyping-off)

### Constructor

Create a new `fbm-send` instance.

```js
new FbmSend([{
  accessToken = process.env.FB_PAGE_ACCESS_TOKEN,
  version = "3.2"
}]);
```

#### Parameters

* **`accessToken`** (optional *`String`*): The Facebook page access token, default to `process.env.FB_PAGE_ACCESS_TOKEN`.
* **`version`** (optional *`String`*): The Facebook Graph API version, default to `3.2`.

### Send Request

Use the `request` method to send an HTTP request to the Send API. All other methods are just a wrapper around this method.

```js
const response = await request({
  recipient,
  formData = false,
  ...body
});
```

#### Parameters

* **`recipient`** (*`String`*|*`Object`*): The message [recipient](#recipient).
* **`formData`** (optional *`Boolean`*): Send the request as a `multipart/form-data` (for uploading a local file), default to `false`.
* **`body`** (`Object`): The request payload to send.

#### Recipient

The recipient can be a `String`: `PSID`, `phone_number`, or a `user_ref`.

It can also be an `Object` as defined in the documentation: [recipient object](https://developers.facebook.com/docs/messenger-platform/reference/send-api#recipient).

```js
// Recipient as a string.
const recipient = "1234567"; // PSID, phone_number, or user_ref

// Equals to recipient as an object.
const recipient = {
  id: "1234567"
}
```

#### Messaging Type

As of Graph API version `2.2`, you're required to pass the `messaging_type` (`String`). There are three supported values for `messaging_type`:

* `RESPONSE` (default value)
* `UPDATE`
* `MESSAGE_TAG`

Read more in the [messaging type documentation](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types).

#### Return

It returns a `Promise` which when resolved contains a response from the API.

#### Examples

Send a simple text to the user:

```js
const response = await fbmSend.request({
  recipient: "123456",
  messaging_type = "RESPONSE",
  message: {
    text: "Hello World!"
  }
});

// Equals to:
const response = await fbmSend.request({
  recipient: {
    id: "123456"
  },
  messaging_type = "RESPONSE",
  message: {
    text: "Hello World!"
  }
});
```

Send a file from a local filesystem:

```js
const fs = require("fs");

const myFile = fs.createReadStream(`${__dirname}/test.txt`);

const response = await fbmSend.request({
  recipient: "123456",
  messaging_type = "RESPONSE",
  message: {
    attachment: {
      type: "file",
      payload: {
        is_reusable: true
      }
    }
  },
  filedata: myFile,
  formData: true // Must be set to TRUE!
});
```

Check the [Send Attachment](#send-attachment) feature for more simpler approach.

Send quick replies:

```js
const response = await fbmSend.request({
  recipient: "123456",
  messaging_type: "RESPONSE",
  message: {
    text: "Choose your Jedi",
    quick_replies: [
      {
        content_type: "text",
        title: "Yoda",
        payload: "yoda"
      },
      {
        content_type: "text",
        title: "Luke Skywalker",
        payload: "luke_skywalker"
      }
    ]
  }
});
```

Send URL buttons:

```js
const response = await fbmSend.request({
  recipient: "123456",
  messaging_type: "RESPONSE",
  message: {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "Jedi Wiki",
        buttons: [
          {
            type: "web_url",
            url: "https://en.wikipedia.org/wiki/Yoda",
            title: "Yoda"
          },
          {
            type: "web_url",
            url: "https://en.wikipedia.org/wiki/Luke_Skywalker",
            title: "Luke Skywalker"
          }
        ]
      }
    }
  }
});
```

### Send Text

Send a plain text to the user:

```js
const response = await fbmSend.text(text, {
  to,
  messagingType: "RESPONSE"
});
```

#### Parameters

* **`text`** (*`String`*): The text to send.
* **`to`** (*`String`*|*`Object`*): The [recipient](#recipient).
* **`messagingType`** (optional *`String`*): The [messaging type](#messaging-type), default to `RESPONSE`.

#### Examples

```js
const response = await fbmSend.text("Hello World!", {
  to: "123456"
});
```

Overriding the default messaging type:

```js
const { UPDATE } from "fbm-send/messaging-types";

const response = await fbmSend.text("Hello World!", {
  to: "123456",
  messagingType: UPDATE
});
```

### Send Attachment

Send an attachment to the user:

```js
const response = await fbmSend.attachment(file, {
  to,
  messagingType = "RESPONSE",
  type = "file",
  isReusable = false
});
```

#### Parameters

* **`file`** (*`String`*): The remote URL of the file or the local file path.
* **`to`** (*`String`*|*`Object`*): The [recipient](#recipient).
* **`messagingType`** (optional *`String`*): The [messaging type](#messaging-type), default to `RESPONSE`.
* **`type`** (optional *`String`*): The type of the attachment: `file`, `image`, `video`, or `audio`. Default to `file`.
* **`isReusable`** (optional *`Boolean`*): Set to `true` to make the attachment reusable (no need to re-upload it again). Default to `false`.

#### Examples

Provide file attachment as a remote URL (must be started with `http://` or `https://`):

```js
const response = await fbmSend.attachment("https://example.com/photo.jpg", {
  to: "1234567",
  type = "image"
});
```

Provide file attachment as a local file:

```js
const response = await fbmSend.attachment(`${__dirname}/test.txt`, {
  to: "1234567",
  type: "file"
});
```

Set `isReusable` to `true` to save the attachment, so it can later be reused without the needs to upload it again.

```js
// The attachment_id can later be used
const { attachment_id } = await fbmSend.attachment(`${__dirname}/test.txt`, {
  to: "1234567",
  type: "file",
  isReusable: true
});
```

Instead of re-uploading the file, the `attachment_id` can later be referenced.

### Send Image/Video/Audio

There are also wrapper methods to send an attachment with image, video, or audio type:

```js
// Send image.
const response = await fbmSend.image(file, {
  to,
  messagingType = "RESPONSE",
  isReusable = false
});

// Send video.
const response = await fbmSend.video(file, {
  to,
  messagingType = "RESPONSE",
  isReusable = false
});

// Send audio.
const response = await fbmSend.audio(file, {
  to,
  messagingType = "RESPONSE",
  isReusable = false
});
```

#### Parameters

* **`file`** (*`String`*): The remote URL of the file or the local file path.
* **`to`** (*`String`*|*`Object`*): The [recipient](#recipient).
* **`messagingType`** (optional *`String`*): The [messaging type](#messaging-type), default to `RESPONSE`.
* **`isReusable`** (optional *`Boolean`*): Set to `true` to make the attachment reusable (no need to re-upload it again). Default to `false`.

#### Examples

```js
const response = await fbmSend.image("https://example.com/photo.jpg", {
  to: "1234567"
});

const response = await fbmSend.video(`../videos/cat.mp4`, {
  to: "1234567",
  isReusable: true
});

const response = await fbmSend.audio("https://example.com/sound.mp3", {
  to: "1234567",
  messagingType: "UPDATE"
});
```

### Send Saved Attachment

When sending an attachment, set the `isReusable` to `true` to save the file for later use. You'll get the `attachment_id` from the API response. You can use this `attachment_id` to send the same file without the needs to re-upload it again.

```js
const response = await fbmSend.attachmentId(id, {
  to,
  messagingType = "RESPONSE",
  type = "file"
});
```

#### Parameters

* **`id`** (*`String`*): The attachment id.
* **`to`** (*`String`*|*`Object`*): The [recipient](#recipient).
* **`messagingType`** (optional *`String`*): The [messaging type](#messaging-type), default to `RESPONSE`.
* **`type`** (optional *`String`*): The type of the attachment: `file`, `image`, `video`, or `audio`. Default to `file`.

#### Examples

```js
// Send an attachment and get the id for later use.
const { attachment_id } = await fbmSend.attachment(`${__dirname}/test.txt`, {
  to: "123456",
  type: "file",
  isReusable: true // Set to TRUE
});

// Use the saved attachment file.
const response = await fbmSend.attachmentId("98765432", {
  to: "567890",
  type: "file"
});
```

### Send Sender Action

Send sender action to the user:

```js
const response = await fbmSend.action(type, {
  to
});
```

#### Parameters

* **`type`** (*`String`*): The action type: `mark_seen`, `typing_on`, or `typing_off`.
* **`to`** (*`String`*|*`Object`*): The [recipient](#recipient).

#### Examples

```js
const { MARK_SEEN, TYPING_ON, TYPING_OFF } = require("fbm-send/src/sender-actions");

const response = await fbmSend.action(MARK_SEEN, {
  to: "1234"
});

const response = await fbmSend.action(TYPING_ON, {
  to: "1234"
});

const response = await fbmSend.action(TYPING_OFF, {
  to: "1234"
});
```

### Send Mark Seen/Typing On/Typing Off

There are also wrapper methods to send mark seen/typing on/typing off action to the user:

```js
const response = await fbmSend.markSeen({ to });

const response = await fbmSend.typingOn({ to });

const response = await fbmSend.typingOff({ to });
```

#### Parameters

* **`to`** (*`String`*|*`Object`*): The [recipient](#recipient).

#### Examples

```js
// Send mark as seen action.
const response = await fbmSend.markSeen({
  to: "1234"
});

// Send typing on action.
const response = await fbmSend.typingOn({
  to: "1234"
});

// Send typing off action.
await fbmSend.typingOff({
  to: "1234"
});
```

## Related

* [fbm-webhook](https://github.com/risan/fbm-webhook): Facebook Messenger webhook middleware for Express.

## License

[MIT](https://github.com/risan/fbm-send/blob/master/LICENSE) © [Risan Bagja Pradana](https://bagja.net)

## Legal

This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by [Facebook](https://www.facebook.com) or any of its affiliates or subsidiaries. This is an independent and unofficial API.
