# channel-dispatcher
[![Build Status](https://travis-ci.org/berezinmv/channel-dispatcher.svg?branch=master)](https://travis-ci.org/berezinmv/channel-dispatcher)
[![Coverage Status](https://coveralls.io/repos/github/berezinmv/channel-dispatcher/badge.svg?branch=dev)](https://coveralls.io/github/berezinmv/channel-dispatcher?branch=dev)

A tiny channel subscribe/publish library.

### Basic usage.

```javascript
// require library
var dispatcher = require('channel-dispatcher');

// subscribe callback
// ident is needed to unsubscribe later
var ident = dispatcher.subscribe('test', function(data) {
  console.log(data);
});

// pass data to channel
// in this case 'Hello to channel' will be printed
dispatcher.publish('test', 'Hello to channel');

// unsubscribe callback from channel
dispatcher.unsubscribe('test', ident);
```

### Using standalone channel object.

```javascript
// require library
var dispatcher = require('channel-dispatcher');

// get channel object
var channel = dispatcher.getChannel('test');

// subscribe callback
// ident is needed to unsubscribe later
var ident = channel.subscribe(function(data) {
  console.log(data);
});

// pass data to channel
// in this case 'Hello to standalone channel' will be printed
channel.publish('Hello to standalone channel');

// unsubscribe callback from channel
channel.unsubscribe(ident);
```

### Specifying context
You can pass context along with callback
```javascript
// context object
var context = {foo: "context data"};

// callback
var callback = function(bar) {
  var foo = this.foo;
  console.log(foo + " " + bar);
};

// subscribe callback with context
dispatcher.subscribe('test', callback, context);
// or using channel object
// channel.subscribe(callback, context)

// pass data
// 'context data passed data' will be printed
dispatcher.publish('test', "passed data");
```

### Show warnings
Warnings is disabled by default.
```javascript
// show warnings
dispatcher.setLogging(true);
```
