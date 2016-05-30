var assert = require('chai').assert;
var dispatcher = require('../');

describe('channelDispatcher', function() {
  describe('#subscribe()', function() {
    it('should return unique idents', function() {
      var sub1 = dispatcher.subscribe('test', function() {});
      var sub2 = dispatcher.subscribe('test', function() {});
      var sub3 = dispatcher.subscribe('test', function() {});
      assert(sub1.ident !== sub2.ident);
      assert(sub2.ident !== sub3.ident);
      assert(sub1.ident !== sub3.ident);
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
    });

    it('should return subscriber as object', function() {
      var callback = function() {};
      var sub = dispatcher.subscribe('test', callback);
      assert(typeof sub === 'object');
      sub.unsubscribe();
    });

    it('should return undefined when callback is not a function', function() {
      // subscribe
      var sub1 = dispatcher.subscribe('test', null);
      var sub2 = dispatcher.subscribe('test', 0);
      var sub3 = dispatcher.subscribe('test', {});

      // check
      assert(typeof sub1 === 'undefined');
      assert(typeof sub2 === 'undefined');
      assert(typeof sub3 === 'undefined');
    });
  });

  describe('#unsubscribe()', function() {
    it('should unsubscribe callback from channel', function(done) {
      var sub = dispatcher.subscribe('test', function() {
        done(); // this shouldn't be called
      });
      sub.unsubscribe();
      dispatcher.publish('test', 'data');
      done();
    });
  });

  describe('#publish()', function() {
    it('calls subscribed callbacks with passed data', function(done) {
      var sub = dispatcher.subscribe('test', function(data) {
        assert.equal(data, 'success');
        sub.unsubscribe();
        done();
      });
      dispatcher.publish('test', 'success');
    });

    it('calls subscribed callbacks with correct context', function(done) {
      var sub = dispatcher.subscribe('test', function() {
        assert.equal(this.value, 'success');
        sub.unsubscribe();
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
      assert.equal(typeof channel.publish, 'function');
    });

    describe('channelObject', function() {
      var channel = dispatcher.getChannel('test');

      describe('#subscribe()', function() {
        it('should return unique idents', function() {
          var sub1 = channel.subscribe(function() {});
          var sub2 = channel.subscribe(function() {});
          var sub3 = channel.subscribe(function() {});
          assert(sub1.ident !== sub2.ident);
          assert(sub1.ident !== sub3.ident);
          assert(sub2.ident !== sub3.ident);
          sub1.unsubscribe();
          sub2.unsubscribe();
          sub3.unsubscribe();
        });

        it('should return subscriber as object', function() {
          var sub = channel.subscribe(function() {});
          assert(typeof sub === 'object');
          sub.unsubscribe();
        });

        it('should return undefined when callback is not a function', function() {
          // subscribe
          var sub1 = channel.subscribe(null);
          var sub2 = channel.subscribe(0);
          var sub3 = channel.subscribe({});

          // check
          assert(typeof sub1 === 'undefined');
          assert(typeof sub2 === 'undefined');
          assert(typeof sub3 === 'undefined');
        });
      });

      describe('#unsubscribe()', function() {
        it('should unsubscribe callback from channel', function(done) {
          var sub = channel.subscribe(function() {
            done(); // this shouldn't be called
          });
          sub.unsubscribe();
          channel.publish('data');
          done();
        });
      });

      describe('#publish()', function() {
        it('calls subscribed callbacks with passed data', function(done) {
          var sub = channel.subscribe(function(data) {
            assert.equal(data, 'success');
            sub.unsubscribe();
            done();
          });
          channel.publish('success');
        });

        it('calls subscribed callbacks with correct context', function(done) {
          var sub = channel.subscribe(function() {
            assert.equal(this.value, 'success');
            sub.unsubscribe();
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

  describe('#setLogging()', function() {
    it('shouldn\'t throw an error with any arguments', function() {
      dispatcher.setLogging(true);
      dispatcher.setLogging(null);
      dispatcher.setLogging(0);
      dispatcher.setLogging('text');
      dispatcher.setLogging(false);
    });
  });

  describe('#getLogging()', function() {
    it('should always return boolean value', function() {
      dispatcher.setLogging(true);
      assert(typeof dispatcher.getLogging() === 'boolean');

      dispatcher.setLogging(null);
      assert(typeof dispatcher.getLogging() === 'boolean');

      dispatcher.setLogging(0);
      assert(typeof dispatcher.getLogging() === 'boolean');

      dispatcher.setLogging('text');
      assert(typeof dispatcher.getLogging() === 'boolean');

      dispatcher.setLogging(false);
      assert(typeof dispatcher.getLogging() === 'boolean');
    });
  });
});
