var assert = require('chai').assert;
var dispatcher = require('../');

describe('channelDispatcher', function() {
  describe('subscribe', function() {
    it('should return subscriber ident as a string value', function() {
      dispatcher.createChannel('test');
      var ident = dispatcher.subscribe('test');
      assert(typeof ident === "string");
    });
  });
});
