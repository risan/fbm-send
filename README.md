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
    * [Send Text](#send-text)
    * [Send Attachments](#send-attachments)
    * [Send Quick Replies](#send-quick-replies)
    * [Send Buttons](#send-buttons)
    * [Send Generic](#send-generic)

## Install

This package depends on [axios](https://github.com/axios/axios) library, so you need to install it too.

```bash
$ npm install axios messenger-client
```

## Basic Usage

Here's a basic usage on sending a text reply to the user identifed by and id of `123`.

```js
import MessengerClient from 'messenger-client';

const client = new MessengerClient({ pageAccessToken: 'YOUR_PAGE_ACCESS_TOKEN' });

client.sendText({ recipientId: 123, text: 'Hello World 🌎' })
  .then(data => console.log(data))
  .catch(e => console.error(e.message));
```

## API

### Constructor

```js
const client = new MessengerClient({ pageAccessToken, [apiVersion] });
```

#### Parameters:
- **`pageAccessToken`** (*`String`*): The access token for the page where the Messenger bot will be used. To get your page access token, heads up to [Facebook apps](https://developers.facebook.com/apps) page and select the app that you use for your Messenger bot. Within your app page, select the **Messenger** >> **Settings** menu on the left. On this Messenger settings console, you'll find **Token Generation** section to generate the access token
- **`apiVersion`** (*`String`*): The Facebook Messenger API version to use. Optional parameter, default to `2.11`

### Messaging Type

As of the release of Messenger Platform v2.2, the Send API requires you to provide the `messaging_type` property. You can check all possible values for `messaging_type` in the [documentation](https://developers.facebook.com/docs/messenger-platform/send-messages#messaging_types). You can pass the `messagingType` property to all send methods and if you not set it, it will be default to `RESPONSE`.

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

#### Parameters:
- **`data`** (*`Object`*): An object of payload that you need to provide to Facebook Messenger Send API

Check out the Send API [documentation](https://developers.facebook.com/docs/messenger-platform/reference/send-api/#payload) to see all possible payload properties.

#### Example
Sending a text message using a basic `send` method:

```js
client.send({
    messaging_type: Messenger.MESSAGING_TYPE_RESPONSE,
    recipient: {
      id: 123
    },
    message: {
      text: 'May the force be with you ✨'
    }
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

### Send Text

```js
client.sendText({ recipientId, text, [messagingType] });
```

#### Parameters:
- **`recipientId`** (*`Integer`*): The recipient ID
- **`text`** (*`String`*): The text that you want to send to the user
- **`messagingType`** (*`String`)*: The [messaging type](#messaging-type). Optional parameter, default to `RESPONSE`

#### Example

```js
client.sendText({
    recipientId: 123,
    text: 'Do or do not. There is no try.'
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

### Send Attachments

```js
client.sendImage({ recipientId, url, [messagingType] });
client.sendAudio({ recipientId, url, [messagingType] });
client.sendVideo({ recipientId, url, [messagingType] });
client.sendFile({ recipientId, url, [messagingType] });
```

#### Parameters:
- **`recipientId`** (*`Integer`*): The recipient ID
- **`url`** (*`String`*): The URL of the file that you want to send
- **`messagingType`** (*`String`)*: The [messaging type](#messaging-type). Optional parameter, default to `RESPONSE`

#### Example

```js
client.sendImage({
    recipientId: 123,
    url: 'https://media.giphy.com/media/ArrVyXcjSzzxe/giphy-downsized.gif'
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

### Send Quick Replies

```js
client.sendQuickReplies({ recipientId, text, replies [messagingType] });
```

#### Parameters:
- **`recipientId`** (*`Integer`*): The recipient ID
- **`text`** (*`String`*): The main text to send along with the quick replies
- **`replies`** (*`Array`*): An array of quick reply options
- **`messagingType`** (*`String`)*: The [messaging type](#messaging-type). Optional parameter, default to `RESPONSE`

Check the quick replies [documentation](https://developers.facebook.com/docs/messenger-platform/reference/send-api/quick-replies#quick_reply) to see all possible properties for `replies` parameter.

#### Example

```js
client.sendQuickReplies({
    recipientId: 123,
    text: 'Choose your favorite spacecraft:',
    replies: [
      {
        content_type: 'text',
        title: 'Millennium Falcon',
        payload: 'MILLENNIUM_FALCON_IS_SELECTED'
      },
      {
        content_type: 'text',
        title: 'Star Destroyer',
        payload: 'STAR_DESTROYER_IS_SELECTED'
      }
    ]
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

### Send Buttons

```js
client.sendButtons({ recipientId, text, buttons [messagingType] });
```

#### Parameters:
- **`recipientId`** (*`Integer`*): The recipient ID
- **`text`** (*`String`*): The main text to send along with the buttons
- **`buttons`** (*`Array`*): An array that consist of 1-3 button objects
- **`messagingType`** (*`String`)*: The [messaging type](#messaging-type). Optional parameter, default to `RESPONSE`

Check the buttons [documentaion](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons) to see all possible button types and how to construct them.

#### Example

```js
client.sendButtons({
    recipientId: 123,
    text: 'Check out for more detail',
    buttons: [
      {
        type: 'web_url',
        url: 'http://www.starwars.com',
        title: 'Star Wars Homepage'
      },
      {
        type: 'web_url',
        url: 'https://en.wikipedia.org/wiki/Star_Wars',
        title: 'Star Wars Wikipedia'
      }
    ]
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

### Send Generic

```js
client.sendGeneric({ recipientId, elements [messagingType] });
```

#### Parameters:
- **`recipientId`** (*`Integer`*): The recipient ID
- **`elements`** (*`Array`*): An array of structured template elements that you want to send, maximum up to 10 items
- **`messagingType`** (*`String`)*: The [messaging type](#messaging-type). Optional parameter, default to `RESPONSE`

Check the generic [documentaion](https://developers.facebook.com/docs/messenger-platform/reference/template/generic#elements) to see all possible element properties that you can provide.

#### Example

```js
client.sendGeneric({
    recipientId,
    elements: [{
      title: 'Do or do not. There is no try.',
      image_url: 'https://media.giphy.com/media/ArrVyXcjSzzxe/giphy-downsized.gif',
      buttons: [
        {
          type: 'postback',
          title: 'Do',
          payload: 'DO_IS_CLICKED',
        },
        {
          type: 'postback',
          title: 'Try',
          payload: 'TRY_IS_CLICKED',
        }
      ]
    }]
  })
  .then(data => console.log(data))
  .catch(e => console.error(e));
```

## License

MIT © [Risan Bagja Pradana](https://risan.io)

## Legal

This code is in no way affiliated with, authorized, maintained, sponsored or endorsed by [Facebook](https://www.facebook.com) or any of its affiliates or subsidiaries. This is an independent and unofficial API.
