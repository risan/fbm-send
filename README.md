# Messenger Client

[![Latest Stable Version](https://img.shields.io/npm/v/messenger-client.svg?style=flat-square)](https://www.npmjs.com/package/messenger-client)
[![Build Status](https://img.shields.io/travis/risan/messenger-client.svg?style=flat-square)](https://travis-ci.org/risan/messenger-client)
[![Test Coverage](https://img.shields.io/codeclimate/c/risan/messenger-client.svg?style=flat-square)](https://codeclimate.com/github/risan/messenger-client/test_coverage)
[![Maintainability](https://img.shields.io/codeclimate/maintainability/risan/messenger-client.svg?style=flat-square)](https://codeclimate.com/github/risan/messenger-client/maintainability)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/risan/messenger-client)
[![License](https://img.shields.io/npm/l/messenger-client.svg?style=flat-square)](https://www.npmjs.com/package/messenger-client)

Javascript library for sending a message through Facebook Messenger send API.

## Table of Contents

* [Install](#install)
* [Basic Usage](#basic-usage)
* [API](#api)
    * [Constructor](#constructor)
    * [Messaging Type](#messaging-type)
    * [Interacts with Facebook Messenger Send API](#interacts-with-facebook-messenger-send-api)
    * [Sending Text](#sending-text)

## Install

This package depends on [axios](https://github.com/axios/axios) library, so you need to install it too.

```bash
$ npm install axios messenger-client
```

## Basic Usage

Here's a basic usage on sending a text reply to the user identifed by `RECIPIENT_ID`.

```js
import MessengerClient from 'messenger-client';

const client = new MessengerClient({ pageAccessToken: 'YOUR_PAGE_ACCESS_TOKEN' });

client.sendText({ recipientId: 'RECIPIENT_ID', text: 'Hello World' })
  .then(data => console.log(data))
  .catch(e => console.error(e.message));
```

## API

### Constructor

```js
const client = new MessengerClient({ pageAccessToken, [apiVersion] });
```

####  Required Parameters:
- `pageAccessToken` (`String`): The access token for the page where the Messenger bot will be used. To get your page access token, heads up to [Facebook apps](https://developers.facebook.com/apps) page and select the app that you use for your Messenger bot. Within your app page, select the **Messenger** >> **Settings** menu on the left. On this Messenger settings console, you'll find **Token Generation** section to generate the access token.

#### Optional Parameters:
- `apiVersion` (`String`): The Facebook Messenger API version to use, default to `2.11`.

### Messaging Type

As of the release of Messenger Platform v2.2, the Send API requires you to provide the `messaging_type` property. You can check all possible values for `messaging_type` [here](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types). You can pass the `messagingType` property to all send methods and if you not set it, it will be default to `RESPONSE`.

This package also provides static properties that you can use to represent the messaging type value:

```js
MessengerClient.MESSAGING_TYPE_RESPONSE; // RESPONSE
MessengerClient.MESSAGING_TYPE_UPDATE; // UPDATE
MessengerClient.MESSAGING_TYPE_MESSAGE_TAG; // MESSAGE_TAG
MessengerClient.MESSAGING_TYPE_NON_PROMOTIONAL_SUBSCRIPTION; // NON_PROMOTIONAL_SUBSCRIPTION
```

### Interacts with Facebook Messenger Send API

This is the most basic API to allow you interact directly with Facebook Messenger send API.

```js
client.send(data);
```

#### Required Parameters
- `data` (`Object`): An object of payload that you need to provide to Facebook Messenger Send API. Check the [Send API Documentation](https://developers.facebook.com/docs/messenger-platform/reference/send-api/#payload) to see all possible payload properties.

#### Example
Sending a text message using a basic `send` method:

```js
client.send({
    messaging_type: Messenger.MESSAGING_TYPE_RESPONSE,
    recipient: {
      id: 'RECIPIENT_ID'
    },
    message: {
      text: 'Hello World'
    }
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

### Sending Text

```js
client.sendText({ recipientId, text, messagingType });
```

#### Required Parameters
- `recipientId` (`Integer`): The recipient ID.
- `text` (`String`): The text that you want to send to the user

#### Optional Parameters
- `messagingType` (`String`): The [messaging type](#messaging-type), default to `RESPONSE`.

#### Example

```js
client.sendText({
    recipientId: 'RECIPIENT_ID',
    text: 'Hello World'
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

## License

MIT © [Risan Bagja Pradana](https://risan.io)

## Legal

This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by [Facebook](https://www.facebook.com) or any of its affiliates or subsidiaries. This is an independent and unofficial API.
