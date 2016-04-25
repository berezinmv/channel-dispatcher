var assert = require('chai').assert;
var dispatcher = require('../');

describe('channelDispatcher', function() {
  beforeEach(function() {
    if (dispatcher.channelExist('test')) {
      dispatcher.destroyChannel('test');
    }
    return dispatcher.createChannel('test');
  });

  describe('#subscribe()', function() {
    it('should return subscriber ident as a string value', function() {
      var callback = function() {};
      var ident = dispatcher.subscribe('test', callback);
      assert(typeof ident === "string");
    });

    it('should return undefined when callback is not a function', function() {
      var ident1 = dispatcher.subscribe('test', null);
      var ident2 = dispatcher.subscribe('test', 1);
      var ident3 = dispatcher.subscribe('test', "123");
      var ident4 = dispatcher.subscribe('test', {});
      assert(typeof ident1 === "undefined");
      assert(typeof ident2 === "undefined");
      assert(typeof ident3 === "undefined");
      assert(typeof ident4 === "undefined");
    });
  });

  describe('#publish()', function() {
    it('calls subscribed callbacks with passed data', function(done) {
      var ident = dispatcher.subscribe('test', function(data) {
        assert.equal(data, 'success');
        dispatcher.unsubscribe('test', ident);
        done();
      });
      dispatcher.publish('test', 'success');
    });

    it('calls subscribed callbacks with corrent context', function(done) {
      var ident = dispatcher.subscribe('test', function() {
        assert.equal(this.value, "success");
        dispatcher.unsubscribe('test', ident);
        done();
      }, {value: "success"});
      dispatcher.publish('test', 'success');
    });

  });
});
