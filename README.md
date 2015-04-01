# Unchatbar Data Chat
[![Build Status](https://travis-ci.org/unchatbar/unchatbar-data-chat.svg?branch=redesign)](https://travis-ci.org/unchatbar/unchatbar-data-chat)

data chat 

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
* luegg.directives


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
<un-data-chat-message-box data-channel="{{[CHANNELNAME]}}" data-user-map="[USERLIST IN CHANNEL]"></un-data-chat-message-box>
```


* output unread message

>
```html
<un-data-chat-unread-message data-user-map="[USERLIST IN CHANNEL]"></un-data-chat-unread-message>
```

* output count of unread message

>
```html
<un-data-chat-count-unread-message ></un-data-chat-count-unread-message>
```

## Events

* **MessageUpdateReadMessage**: add new read message
* **MessageUpdateUnreadMessage**: add new unread message (contains `unread` :  unread message )
