#channel-dispatcher

##A tiny channel subscribe/publish library.

### Basic usage

```javascript
// require library
var dispatcher = require('channel-dispatcher');

// create channel
dispatcher.createChannel('test');

// subscribe callback
// ident is needed to unsubscribe callback later
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
