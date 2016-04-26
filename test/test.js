var assert = require('chai').assert;
var dispatcher = require('../');

describe('channelDispatcher', function() {
  describe('#subscribe()', function() {
    it('should return subscriber ident as a string value', function() {
      var callback = function() {};
      var ident = dispatcher.subscribe('test', callback);
      assert(typeof ident === 'string');
      dispatcher.unsubscribe('test', ident);
    });

    it('should return undefined when callback is not a function', function() {
      // subscribe
      var ident1 = dispatcher.subscribe('test', null);
      var ident2 = dispatcher.subscribe('test', 0);
      var ident3 = dispatcher.subscribe('test', {});

      // check
      assert(typeof ident1 === 'undefined');
      assert(typeof ident2 === 'undefined');
      assert(typeof ident3 === 'undefined');

      // unsubscribe
      dispatcher.unsubscribe('test', ident1);
      dispatcher.unsubscribe('test', ident2);
      dispatcher.unsubscribe('test', ident3);
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
      dispatcher.unsubscribe('test', 'ident');
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
        assert.equal(this.value, 'success');
        dispatcher.unsubscribe('test', ident);
        done();
      }, {value: 'success'});
      dispatcher.publish('test', 'success');
    });

    it('shouldn\'t throw error if there is no subcribers', function() {
      dispatcher.publish('test', 'data');
    });
  });

  describe('#getChannel()', function() {
    it('should return fully formed channel object', function() {
      var channel = dispatcher.getChannel('test');
      assert.equal(typeof channel.subscribe, 'function');
      assert.equal(typeof channel.unsubscribe, 'function');
      assert.equal(typeof channel.publish, 'function');
    });

    describe('channelObject', function() {
      var channel = dispatcher.getChannel('test');

      describe('#subscribe()', function() {
        it('should return subscriber ident as a string value', function() {
          var ident = channel.subscribe(function() {});
          assert(typeof ident === 'string');
          channel.unsubscribe(ident);
        });

        it('should return undefined when callback is not a function', function() {
          // subscribe
          var ident1 = channel.subscribe(null);
          var ident2 = channel.subscribe(null);
          var ident3 = channel.subscribe(null);

          // check
          assert(typeof ident1 === 'undefined');
          assert(typeof ident2 === 'undefined');
          assert(typeof ident3 === 'undefined');

          //unsubscribe
          channel.unsubscribe(ident1);
          channel.unsubscribe(ident2);
          channel.unsubscribe(ident3);
        });
      });

      describe('#unsubscribe()', function() {
        it('should unsubscribe callback from channel', function(done) {
          var ident = channel.subscribe(function() {
            done(); // this shouldn't be called
          });
          channel.unsubscribe(ident);
          channel.publish('data');
          done();
        });

        it('shouldn\'t thow error with valid ident', function() {
          var ident = channel.subscribe(function() {});
          channel.unsubscribe(ident);
        });

        it('shouldn\'t thow error with invalid ident', function() {
          channel.unsubscribe('ident');
          channel.unsubscribe(123);
          channel.unsubscribe(null);
        });
      });

      describe('#publish()', function() {
        it('calls subscribed callbacks with passed data', function(done) {
          var ident = channel.subscribe(function(data) {
            assert.equal(data, 'success');
            channel.unsubscribe(ident);
            done();
          });
          channel.publish('success');
        });

        it('calls subscribed callbacks with correct context', function(done) {
          var ident = channel.subscribe(function() {
            assert.equal(this.value, 'success');
            channel.unsubscribe(ident);
            done();
          }, {value: 'success'});
          channel.publish('success');
        });

        it('shouldn\'t throw error if there is no subcribers', function() {
          channel.publish('data');
        });
      });
    });
  });
});
