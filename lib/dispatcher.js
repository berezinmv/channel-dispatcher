var identSequence = (function() {
  /**
   * Sequence counter
   * @type {Number}
   */
  var id = 0;

  /**
   * Increment id number and return it as string
   * @return {string} - Ident
   */
  function next() {
    return (id++).toString();
  }

  return {next: next};
})();

var channelDispatcher = (function() {
  /**
   * Objects which represents subscriber
   * @typedef  {Object}   SubscriberObject
   * @property {string}   ident
   * @property {Function} callback
   * @property {any=}     context
   */

  /**
   * Array which represents channel
   * @typedef {Array.<SubscriberObject>} InternalChannel
   */

  /**
   * Internal channels representation
   * @type {Array.<string, InternalChannel>}
   */
   var channels = {};

   /**
    * Show warnings
    * @type {Boolean}
    */
   var logging = false;

   /**
    * Activate/deactivete logging
    * @param {bool} flag - Flag
    */
   function setLogging(flag) {
     logging = flag;
   }

   /**
    * Show warning if logging as enabled
    * @param  {string} message - Message to show
    */
   function showWarning(message) {
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
   * Create new channel
   * @param  {string} channel - Channel name
   */
  function createChannel(channel) {
    if (!channelExist(channel)) {
      channels[channel] = [];
    }
  }

  /**
   * Subscribe callback to channel
   * @param  {string}   channel  - Cahnnel name
   * @param  {Function} callback - Callback to call
   * @param  {any=}     context  - Context for applying callback
   * @return {string}              Subscriber ident
   */
  function subscribe(channel, callback, context) {
    if (!channelExist(channel)) {
      createChannel(channel);
    }
    if (typeof callback !== "function") {
      return showWarning("Callback must be a Function type");
    }
    var subscriberIdent = identSequence.next();
    var subscriberObject = {
      ident: subscriberIdent,
      callback: callback,
      context: context
    };
    channels[channel].push(subscriberObject);
    return subscriberIdent;
  }

  /**
   * Unsubscribe callback from channel
   * @param  {string} channel         - Channel name
   * @param  {string} subscriberIdent - Subscriber ident
   */
  function unsubscribe(channel, subscriberIdent) {
    if (!channelExist(channel)) {
      return;
    }
    channels[channel] = channels[channel].filter(function (subscriberObject) {
      return subscriberObject.ident !== subscriberIdent;
    });
  }

  /**
   * Publish data to channel
   * @param  {string} channel - Channel name
   * @param  {any}    data    - Data to pass to subscribers
   */
  function publish(channel, data) {
    if (!channelExist(channel)) {
      createChannel(channel);
    }
    var subscribers = channels[channel];
    subscribers.forEach(function(subscriber) {
      var callback = subscriber.callback;
      var context = subscriber.context;
      callback.apply(context, [data]);
    });
  }

  /**
   * Return standalone channel object
   * @param  {string} channel channel name
   * @return {Object}         Channel object
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
    setLogging: setLogging
  };
})();

if (module) {
  module.exports = channelDispatcher;
}
