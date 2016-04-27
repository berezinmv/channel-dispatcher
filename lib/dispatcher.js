var identSequence = (function() {
  /**
   * Sequence counter
   * @type {number}
   */
  var id = 0;

  /**
   * Timestamp for generating unique id's
   * @type {number}
   */
  var timestamp = new Date().getTime();

  /**
   * Increment and return counter
   * @return {number} Counter
   */
  function nextCounter() {
    return id++;
  }

  /**
   * Increment id number and return it as string
   * @return {string} - Ident
   */
  function next() {
    return (timestamp + nextCounter()).toString();
  }

  return {next: next};
})();

var channelDispatcher = (function() {
  /**
   * @typedef  {Object}   SubscriberObject
   * @property {string}   ident
   * @property {Function} callback
   * @property {any=}     context
   */

  /**
   * @typedef {Array.<SubscriberObject>} InternalChannel
   */

  /**
   * Internal channels representation
   * @type {Array.<string, InternalChannel>}
   */
   var channels = {};

   /**
    * Show warnings
    * @type {bool}
    */
   var logging = false;

   /**
    * Activate/deactivete logging
    * @param {bool} flag - Flag
    */
   function setLogging(flag) {
     logging = !!flag;
   }

   /**
    * Returns logging status
    * @return {bool} Logging status
    */
   function getLogging() {
     return logging;
   }

   /**
    * Show warning if logging as enabled
    * @param  {string} message - Message to show
    */
   function showWarning(message) {
     /* istanbul ignore if */
     if (logging) {
       console.warn(message);
     }
   }

  /**
   * Is required channel exist
   * @param  {string} channel - Channel name
   * @return {bool}
   */
  function channelExist(channel) {
    return typeof channels[channel] !== "undefined";
  }

  /**
   * Returns channel's subscribers
   * @param  {string} channel - Channel name
   * @return {Array.<SubscriberObject>} Subscribers
   */
  function getSubscribers(channel) {
    if (!channelExist(channel)) {
      channels[channel] = [];
    }
    return channels[channel];
  }

  /**
   * Subscribe callback to channel
   * @param  {string}   channel  - Cahnnel name
   * @param  {Function} callback - Callback to call
   * @param  {any=}     context  - Context for applying callback
   * @return {string}              Subscriber ident
   */
  function subscribe(channel, callback, context) {
    if (typeof callback !== "function") {
      return showWarning("Callback must be a Function type");
    }
    var ident = identSequence.next();
    var subscriber = {
      ident: ident,
      callback: callback,
      context: context
    };
    getSubscribers(channel).push(subscriber);
    return ident;
  }

  /**
   * Unsubscribe callback from channel
   * @param  {string} channel - Channel name
   * @param  {string} ident   - Subscriber ident
   */
  function unsubscribe(channel, ident) {
    var subscribers = getSubscribers(channel);
    subscribers.map(function (subscriber, index) {
      if (subscriber.ident !== ident) {
        return subscriber;
      } else {
        delete subscribers[index];
      }
    });
  }

  /**
   * Publish data to channel
   * @param  {string} channel - Channel name
   * @param  {any}    data    - Data to pass to subscribers
   */
  function publish(channel, data) {
    var subscribers = getSubscribers(channel);
    subscribers.forEach(function(subscriber) {
      var callback = subscriber.callback;
      var context = subscriber.context;
      callback.apply(context, [data]);
    });
  }

  /**
   * @typedef {Object} PublicChannel
   * @method  subscribe
   * @method  unsubscribe
   * @method  publish
   */

  /**
   * Return standalone channel object
   * @param  {string} channel - Channel name
   * @return {PublicChannel}    Channel object
   */
  function getChannel(channel) {
    return {
      /**
       * Subscribe callback to channel
       * @param  {Function} callback - Callback to call
       * @param  {any=}     context  - Context for applying callback
       * @return {string}              Subscriber ident
       */
      subscribe: function(callback, context) {
        return subscribe(channel, callback, context);
      },

      /**
       * Unsubscribe callback from channel
       * @param  {string} subscriberIdent - Subscriber ident
       */
      unsubscribe: function(subscriberIdent) {
        unsubscribe(channel, subscriberIdent);
      },

      /**
       * Publish data to channel
       * @param  {any} data - Data to pass to subscribers
       */
      publish: function(data) {
        publish(channel, data);
      }
    };
  }

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    publish: publish,
    getChannel: getChannel,
    setLogging: setLogging,
    getLogging: getLogging
  };
})();

/* istanbul ignore next */
if (module) {
  module.exports = channelDispatcher;
}
