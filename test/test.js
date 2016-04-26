var assert = require('chai').assert;
var dispatcher = require('../');

describe('channelDispatcher', function() {
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

  describe('#unsubscribe()', function() {
    it('should unsubscribe callback from channel', function(done) {
      var ident = dispatcher.subscribe('test', function() {
        done(); // this shouldn't be called
      });
      dispatcher.unsubscribe('test', ident);
      dispatcher.publish('test', 'data');
      done();
    });

    it('shouldn\'t thow error with valid ident', function() {
      var ident = dispatcher.subscribe('test', function() {});
      dispatcher.unsubscribe('test', ident);
    });

    it('shouldn\'t thow error with invalid ident', function() {
      dispatcher.unsubscribe('test', "ident");
      dispatcher.unsubscribe('test', 123);
      dispatcher.unsubscribe('test', null);
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

    it('calls subscribed callbacks with correct context', function(done) {
      var ident = dispatcher.subscribe('test', function() {
        assert.equal(this.value, "success");
        dispatcher.unsubscribe('test', ident);
        done();
      }, {value: "success"});
      dispatcher.publish('test', 'success');
    });

    it('shouldn\'t throw error if there is no subcribers', function() {
      dispatcher.publish('test', "data");
    });
  });

  describe('#getChannel', function() {
    it('should return fully functional channel object', function() {
      var channel = dispatcher.getChannel('test');
      assert.equal(typeof channel.subscribe, 'function');
      assert.equal(typeof channel.unsubscribe, 'function');
      assert.equal(typeof channel.publish, 'function');
    });
  });
});
