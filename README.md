# Facebook Messenger Send API Client

[![Build Status](https://flat.badgen.net/travis/risan/fbm-send)](https://travis-ci.org/risan/fbm-send)
[![Test Coverage](https://flat.badgen.net/codeclimate/coverage/risan/fbm-send)](https://codeclimate.com/github/risan/fbm-send)
[![Maintainability](https://flat.badgen.net/codeclimate/maintainability/risan/fbm-send)](https://codeclimate.com/github/risan/fbm-send)
[![Latest Stable Version](https://flat.badgen.net/npm/v/fbm-send)](https://www.npmjs.com/package/fbm-send)
[![Node Version](https://flat.badgen.net/npm/node/fbm-send)](https://www.npmjs.com/package/fbm-send)
[![Code Style: Prettier](https://flat.badgen.net/badge/code%20style/prettier/ff69b4)](https://github.com/prettier/prettier)
[![License](https://flat.badgen.net/npm/license/fbm-send)](https://github.com/risan/fbm-send/blob/master/LICENSE)

JavaScript library for interacting with Facebook Messenger send API.

## Installation

```bash
$ npm install fbm-send

# Or if you use Yarn
$ yarn add fbm-send
```

## Quick Start

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
    message: {
      text: "Hello World!"
    }
  });
} catch(error) {
  if (error.hasOwnProperty("response")) {
    console.log(error.response); // The API error response object.
  }
}
```

## API

### Constructor

Create a new `fbm-send` instance.

```js
new FbmSend([{
  accessToken = process.env.FB_PAGE_ACCESS_TOKEN,
  version = "3.2"
}]);
```

#### Parameters

* `**accessToken**` (optional `*String*`): The Facebook page access token, default to `process.env.FB_PAGE_ACCESS_TOKEN`.
* `**version**` (optional `*String*`): The Facebook Graph API version, default to `3.2`.

### Send Request

Use the `request` method to send an HTTP request to the Send API. All other methods are just a wrapper around this method.

```js
const response = await request({
  recipient,
  messaging_type = "RESPONSE",
  formData = false,
  ...body
});
```

#### Parameters

* `**recipient**` (`*String*`|`*Object*`): The message [recipient](#recipient).
* `**messaging_type**` (optional `*String*`): The [messaging type](#messaging-type), default to `RESPONSE`.
* `**formData**` (optional `*Boolean*`): Send the request as a `multipart/form-data` (for uploading a local file), default to `false`.
* `**body**` (`Object`): The request payload to send.

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

### Send Text

Send a plain text to the user:

```js
const response = await fbmSend.text(text, {
  to,
  messagingType: "RESPONSE"
});
```

#### Parameters

* `**text**` (`*String*`): The text to send.
* `**to**` (`*String*`|`*Object*`): The [recipient](#recipient).
* `**messagingType**` (optional `*String*`): The [messaging type](#messaging-type), default to `RESPONSE`.

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

* `**file**` (`*String*`): The remote URL of the file or the local file path.
* `**to**` (`*String*`|`*Object*`): The [recipient](#recipient).
* `**messagingType**` (optional `*String*`): The [messaging type](#messaging-type), default to `RESPONSE`.
* `**type**` (optional `*String*`): The type of the attachment: `file`, `image`, `video`, or `audio`. Default to `file`.
* `**isReusable**` (optional `*Boolean*`): Set to `true` to make the attachment reusable (no need to re-upload it again). Default to `false`.

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

* `**file**` (`*String*`): The remote URL of the file or the local file path.
* `**to**` (`*String*`|`*Object*`): The [recipient](#recipient).
* `**messagingType**` (optional `*String*`): The [messaging type](#messaging-type), default to `RESPONSE`.
* `**isReusable**` (optional `*Boolean*`): Set to `true` to make the attachment reusable (no need to re-upload it again). Default to `false`.

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

## Related

* [fbm-webhook](https://github.com/risan/fbm-webhook): Facebook Messenger webhook middleware for Express.

## License

MIT © [Risan Bagja Pradana](https://bagja.net)

## Legal

This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by [Facebook](https://www.facebook.com) or any of its affiliates or subsidiaries. This is an independent and unofficial API.
