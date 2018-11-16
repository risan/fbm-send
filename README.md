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

You can use the [fbm-webhook](https://github.com/risan/fbm-webhook) module to listen to the Facebook Messenger webhook events.

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
* `version`: The Facebook Graph API version to use, default to `3.2`.

## Recipe

### Store Page Access Token as Environment Variables

By default, `fbm-send` will look for FB_PAGE_ACCESS_TOKEN on the environment variables. If you set this environment variable, you don't have to pass anything:

```js
const FbmSend = require("fbm-send");

const fbmSend = new FbmSend();

// Is equal to
const fbmSend = new FbmSend({
  accessToken: process.env.FB_PAGE_ACCESS_TOKEN
});
```

### Send File Attachment

```js
const response = await fbmSend.attachment("https://example.com/file.txt", {
  to: event.sender
});
```

You can also send a local file:

```js
const fs = require("fs");

const myFile = fs.createReadStream(`${__dirname}/test.txt`)

const response = await fbmSend.attachment(myFile, {
  to: event.sender
});
```

### Send Image/Video/Audio File

You can pass the `type` option to the `attachment` method:

```js
const response = await fbmSend.attachment("https://example.com/photo.jpg", {
  to: event.sender,
  type: "image" // possible value: file (default), image, video, audio
});
```

There are also `image`, `video`, and `audio` methods:

```js
const response = await fbmSend.image("https://example.com/photo.jpg", {
  to: event.sender
});

const response = await fbmSend.video("https://example.com/video.mp4", {
  to: event.sender
});

const response = await fbmSend.audio("https://example.com/audio.mp3", {
  to: event.sender
});
```

## API

### Constructor

```js
new FbmSend([{
  accessToken = process.env.FB_PAGE_ACCESS_TOKEN,
  version = "3.2"
}]);
```

#### Parameters

* `accessToken` (optional `String`): The Facebook page access token, default to `process.env.FB_PAGE_ACCESS_TOKEN`.
* `version` (optional `String`): The Facebook Graph API version, default to `3.2`.

### `request`

```js
const response = await request({
  recipient,
  messaging_type = "RESPONSE",
  formData = false,
  ...body
});
```

#### Parameters

* `recipient` (`String`|`Object`): The message recipient id (either `PSID`, `phone_number`, or `user_ref`). It can also be a [`recipient`](https://developers.facebook.com/docs/messenger-platform/reference/send-api#recipient) object.
* `messaging_type` (optional `String`): The [messaging type](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types), default to `RESPONSE`.
* `formData` (optional `Boolean`): Send the request as a `multipart/form-data` (for uploading a local file), default to `false`.
* `body` (`Object`): The request payload to send.

#### Return

It returns a `Promise` which when resolved contains a response from the API.

## Related

* [fbm-webhook](https://github.com/risan/fbm-webhook): Facebook Messenger webhook middleware for Express.

## License

MIT © [Risan Bagja Pradana](https://bagja.net)

## Legal

This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by [Facebook](https://www.facebook.com) or any of its affiliates or subsidiaries. This is an independent and unofficial API.
