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
   * @typedef  {Object}   SubscriberObject
   * @property {string}   ident
   * @property {Function} callback
   * @property {any=}     context
   */

  /**
   * Internal channels representation
   * @type {Array.<string, SubscriberObject>}
   */
   var channels = {};

   /**
    * Show warnings
    * @type {Boolean}
    */
   var logging = false;

   /**
    * Activate/deactivete logging
    * @param {[type]} flag [description]
    */
   function setLogging(flag) {
     logging = flag;
   }

   function showWarning(message) {
     if (logging) {
       console.warn(message);
     }
   }

  /**
   * Show console warning
   * @param  {string} channel - Channel name
   * @param  {string} cause   - Warning cause
   */
  function channelWarning(channel, cause) {
    var message = 'Channel ' + channel + " " + cause + " exists!";
    showWarning(message);
  }
  /**
   * Show warning in console saying that channel wasn't exist
   * @param  {string} channel - Channel name
   */
  function channelDoesntExistWarning(channel) {
    channelWarning(channel, "doesn't");
  }

  /**
   * Show warning in console saying that channel already exist
   * @param  {string} channel - Channel name
   */
  function channelAlreadyExistWarning(channel) {
    channelWarning(channel, "already");
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
    if (channelExist(channel)) {
      return channelAlreadyExistWarning(channel);
    }
    channels[channel] = [];
  }

  /**
   * Destroy channel by it's name
   * @param  {string} channel - Channel name
   */
  function destroyChannel(channel) {
    if (!channelExist(channel)) {
      return channelDoesntExistWarning(channel);
    }
    delete channels[channel];
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
      return channelDoesntExistWarning(channel);
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
      return channelDoesntExistWarning(channel);
    }
    channels[channel].filter(function (subscriberObject) {
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
      return channelDoesntExistWarning(channel);
    }
    var subscribers = channels[channel];
    subscribers.forEach(function(subscriber) {
      var callback = subscriber.callback;
      var context = subscriber.context;
      callback.apply(context, [data]);
    });
  }

  /**
   * Create standalone channel object
   * @param  {string}  channel - Channel name
   * @return {Channel}           Channel
   */
  function getChannel(channel) {
    return {
      /**
       * Is required channel exist
       * @return {bool}
       */
      exist: function() {
        return channelExist(channel);
      },

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
      },

      /**
       * Destroy channel
       */
      destroy: function() {
        destroyChannel(channel);
      }
    };
  }

  return {
    createChannel: createChannel,
    destroyChannel: destroyChannel,
    channelExist: channelExist,
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
