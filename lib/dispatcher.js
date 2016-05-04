var identSequence = (function() {
  /**
   * Sequence counter
   * @type {Number}
   * @private
   */
  var counter = 0;

  /**
   * Timestamp for generating unique id's
   * @type {Number}
   * @private
   */
  var timestamp = new Date().getTime();

  /**
   * Increment and return counter
   * @return {Number} Counter
   * @private
   */
  function nextCounter() {
    return counter++;
  }

  /**
   * Increment id number and return it as string
   * @return {String} - Ident
   */
  function next() {
    return (timestamp + nextCounter()).toString();
  }

  return {next: next};
})();

var channelDispatcher = (function() {
  /**
   * @typedef  {Object}   SubscriberObject
   * @property {String}   ident
   * @property {Function} callback
   * @property {Any=}  context
   */

  /**
   * @typedef {Array.<SubscriberObject>} InternalChannel
   */

  /**
   * Internal channels representation
   * @type {Array.<string, InternalChannel>}
   * @private
   */
   var channels = {};

   /**
    * Show warnings
    * @type {Boolean}
    * @private
    */
   var logging = false;

   /**
    * Activate/deactivete logging
    * @param {Boolean} flag - Flag
    */
   function setLogging(flag) {
     logging = !!flag;
   }

   /**
    * Returns logging status
    * @return {Boolean} Logging status
    */
   function getLogging() {
     return logging;
   }

   /**
    * Show warning if logging as enabled
    * @param  {String} message - Message to show
    * @private
    */
   function showWarning(message) {
     /* istanbul ignore if */
     if (logging) {
       console.warn(message);
     }
   }

  /**
   * Returns channel's subscribers
   * @param  {String} channel - Channel name
   * @return {Array.<SubscriberObject>} Subscribers
   * @private
   */
  function getSubscribers(channel) {
    return channels[channel] || [];
  }

  /**
   * Set subscribers for channel
   * @param {string}                   channel     - Channel name
   * @param {Array.<SubscriberObject>} subscribers - Subscribers
   * @private
   */
  function setSubscribers(channel, subscribers) {
    channels[channel] = subscribers;
  }

  /**
   * Delete channel by name
   * @param  {string} channel Channnel name
   * @private
   */
  function deleteChannel(channel) {
    delete channels[channel];
  }

  /**
   * Subscribe callback to channel
   * @param  {String}   channel  - Cahnnel name
   * @param  {Function} callback - Callback to call
   * @param  {Any=}     context  - Context for applying callback
   * @return {String}              Subscriber ident
   */
  function subscribe(channel, callback, context) {
    if (typeof callback !== "function") {
      return showWarning("Callback must be a Function type");
    }
    var ident = identSequence.next();
    var subscribers = getSubscribers(channel).concat({
      ident: ident,
      callback: callback,
      context: context
    });
    setSubscribers(channel, subscribers);
    return ident;
  }

  /**
   * Unsubscribe callback from channel
   * @param  {String} channel - Channel name
   * @param  {String} ident   - Subscriber ident
   */
  function unsubscribe(channel, ident) {
    var subscribers = getSubscribers(channel).filter(function (subscriber) {
      return subscriber.ident !== ident;
    });
    if (subscribers.length === 0) {
      deleteChannel(channel);
    } else {
      setSubscribers(channel, subscribers);
    }
  }

  /**
   * Publish data to channel
   * @param  {String} channel - Channel name
   * @param  {Any}    data    - Data to pass to subscribers
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
   * @param  {String} channel - Channel name
   * @return {PublicChannel}    Channel object
   */
  function getChannel(channel) {
    return {
      /**
       * Subscribe callback to channel
       * @param  {Function} callback - Callback to call
       * @param  {Any=}     context  - Context for applying callback
       * @return {String}              Subscriber ident
       */
      subscribe: function(callback, context) {
        return subscribe(channel, callback, context);
      },

      /**
       * Unsubscribe callback from channel
       * @param  {String} subscriberIdent - Subscriber ident
       */
      unsubscribe: function(subscriberIdent) {
        unsubscribe(channel, subscriberIdent);
      },

      /**
       * Publish data to channel
       * @param  {Any} data - Data to pass to subscribers
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
