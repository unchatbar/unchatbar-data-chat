# Unchatbar Data Chat
[![Build Status](https://travis-ci.org/unchatbar/unchatbar-text-message.svg?branch=master)](https://travis-ci.org/unchatbar/unchatbar-text-message)

Peer to peer chat application using WebRTC technologies

## Requirements
* Node.js 0.10+
* Chrome 26+ or Firefox 23+

## Installation
* Install Bower: `npm install -g bower`
* Install Gunt CLI: `npm install -g grunt-cli`
* Clone repository `git clone git://github.com/unchatbar/unchatbar.git`
* Run `npm install` to install required Node.js modules
* Run `bower install` to install required Bower components


## Dependencies
* angular
* json3
* es5-shim
* bootstrap-css-only
* ngstorage
* lodash
* unchatbar-connection


## Get Started
```javascript
angular.module('app', ['unchatbar-data-chat'])
```

configure route see below




## Configure


* store message Data in local Storage

>
```javascript
MessageProvider.setLocalStorage([TRUE/FALSE]);
```


## API
* send message to users from channel

>
```javascript
Message.send([PEERID],[TEXT-MESAGE],[CHANNEL]);
```

* get all message's from channel

>
```javascript
Message.getMessageFromChannel();
```

* get all unread message's

>
```javascript
Message.getUnreadMessageMap();
```

## Directive

* message box (list of all messages in channel and send from)

>
```html
<un-data-chat-message-box channel="{{[CHANNELNAME]}}"
                                  user-map="[USERLIST IN CHANNEL]"></un-data-chat-message-box>
```


* output unread message

>
```html
<un-data-chat-unread-message user-map="[USERLIST IN CHANNEL]"></un-data-chat-unread-message>
```

## Events

* **MessageUpdateReadMessage**: add new read message
* **MessageUpdateUnreadMessage**: add new unread message
