(function (root, factory) {
  /* istanbul ignore next */
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['exports'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
      // CommonJS
      factory(exports);
  } else {
      // Browser globals
      factory((root.commonJsStrict = {}));
  }
}(this, function (exports) {
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
     * @returns {Number} Counter
     * @private
     */
    function nextCounter() {
      return counter++;
    }

    /**
     * Increment id number and return it as string
     * @returns {String} Ident
     */
    function next() {
      return (timestamp + nextCounter()).toString();
    }

    return {next: next};
  })();

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
    * @returns {Boolean} Logging status
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
    * Delete channel by name
    * @param  {string} channel Channnel name
    * @private
    */
   function deleteChannel(channel) {
     delete channels[channel];
   }

  /**
   * Returns channel's subscribers
   * @param  {String} channel - Channel name
   * @returns {Array.<SubscriberObject>} Subscribers
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
    if (subscribers.length === 0) {
      deleteChannel(channel);
    } else {
      channels[channel] = subscribers;
    }
  }

  /**
   * Unsubscribe callback from channel
   * @param  {String} channel - Channel name
   * @param  {String} ident   - Subscriber ident
   * @private
   */
  function unsubscribe(channel, ident) {
    var subscribers = getSubscribers(channel).filter(function (subscriber) {
      return subscriber.ident !== ident;
    });
    setSubscribers(channel, subscribers);
  }

  /**
   * @typedef {Object} Subscription
   * @property {String}   ident       - Subscriber ident
   * @property {Function} unsubscribe
   */

  /**
   * Subscribe callback to channel
   * @param  {String}   channel  - Cahnnel name
   * @param  {Function} callback - Callback to call
   * @param  {Any=}     context  - Context for applying callback
   * @returns {Subscription} Subscription object
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
    return {
      ident: ident,
      unsubscribe: function() {
        unsubscribe(channel, ident);
      }
    };
  }

  /**
   * Publish data to channel
   * @param {String} channel - Channel name
   * @param {Any}    data    - Data to pass to subscribers
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
   * @function Subscribe
   * @param {Function} callback - Callback
   * @param {Any=}     context  - Context
   * @returns {Subscription} Subscription object
   */

   /**
    * @function Publish
    * @param {Any} data - Data
    */

  /**
   * @typedef {Object} ChannelObject
   * @property {Subscribe} subscribe
   * @property {Publish}   publish
   */

  /**
   * Return standalone channel object
   * @param  {String} channel - Channel name
   * @returns {ChannelObject} Channel object
   */
  function getChannel(channel) {
    return {
      subscribe: function(callback, context) {
        return subscribe(channel, callback, context);
      },
      publish: function(data) {
        publish(channel, data);
      }
    };
  }

  exports.subscribe = subscribe;
  exports.publish = publish;
  exports.getChannel = getChannel;
  exports.setLogging = setLogging;
  exports.getLogging = getLogging;
}));
