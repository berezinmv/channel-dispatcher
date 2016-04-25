# channel-dispatcher
A tiny channel subscribe/publish library.

### Basic usage

```javascript
// require library
var dispatcher = require('channel-dispatcher');

// create channel
dispatcher.createChannel('test');

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

// destroy channel
dispatcher.destroyChannel('test');
```

### Using standalone channel object

```javascript
// require library
var dispatcher = require('channel-dispatcher');

// create channel
dispatcher.createChannel('test');

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

// destroy channel
channel.destroy();
```
