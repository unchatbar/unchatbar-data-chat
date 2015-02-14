# Unchatbar contact
[![Build Status](https://travis-ci.org/unchatbar/unchatbar-phone-book.svg?branch=master)](https://travis-ci.org/unchatbar/unchatbar-phone-book)

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
* ui.router
* angularjs-dropdown-multiselect
* unchatbar-connection
* unchatbar-user

## Get Started
```javascript
angular.module('app', ['unchatbar-data-chat'])
```

configure route see below




## Configure

* necessary routing configuration

>
```javascript
.state('contact', {
    url: '/contact'
})
.state('contact.client', {
    parent: 'contact',
    url: '/user/{clientId}'
})
.state('contact.group', {
    parent: 'contact',
    url: '/group/{groupId}'
});
```

* store PhoneBook Data in local Storage

>
```javascript
PhoneBookProvider.setLocalStorage([TRUE/FALSE]);
```


## API
* get get Client (by peer id)

>
```javascript
PhoneBook.getClient([PEERID]);
```

* get all clients

>
```javascript
PhoneBook.getClientMap();
```

* get new client

>
```javascript
PhoneBook.addClient([PEERID],[PROFILE]);
```

* update client

>
```javascript
PhoneBook.updateClient([PEERID],[Label]);
```

* remove client

>
```javascript
PhoneBook.removeClient([PEERID]);
```

* get a group by groupid

>
```javascript
PhoneBook.getGroup([GROUPID]);
```


* get all groups

>
```javascript
PhoneBook.getGroupMap();
```


* copy a group from other client

>
```javascript
PhoneBook.copyGroupFromPartner([PEERID],[NEWGROUP]);
```

* add a own new group

>
```javascript
PhoneBook.addGroup([GROUPNAME]);
```


* update a group

>
```javascript
PhoneBook.updateGroup([GROUPID],[GROUP]);
```

* remove a group by groupid

>
```javascript
PhoneBook.removeGroup([GROUPID]);
```

* remove a client from group

>
```javascript
PhoneBook.removeGroupByClient([PEERID],[GROUP]);
```

## Directive

* list of all client

>
```html
<un-contact-client-list></un-contact-client-list>
```


* select client

>
```html
<un-contact-client-selected></un-contact-client-selected>
```


* list of all groups

>
```html
<un-contact-group-list></un-contact-group-list>
```


* select group

>
```html
<un-contact-group-selected></un-contact-group-selected>
```


* add new group

>
```html
<un-contact-group-add></un-contact-group-add>
```


## Events

* **PhoneBookUpdate**: phoneBook data was update
