var identSequence = (function() {
  var id = 0;

  /**
   * Increments id number and returns it as string
   * @return {string} Ident
   */
  function next() {
    return (id++).toString();
  }

  return {next: next};
})();

var channelDispatcher = (function() {
  var channels = {};

  /**
   * Show console warning
   * @param  {string} channel Channel name
   * @param  {string} cause   Warning cause
   */
  function channelWarning(channel, cause) {
    var message = 'Channel ' + channel + " " + cause + " exists!";
    console.warn(message);
  }
  /**
   * Show warning in console saying that channel wasn't exist
   * @param  {string} channel Channel name
   */
  function channelDoesntExistWarning(channel) {
    channelWarning(channel, "doesn't");
  }

  /**
   * Show warning in console saying that channel already exist
   * @param  {string} channel Channel name
   */
  function channelAlreadyExistWarning(channel) {
    channelWarning(channel, "already");
  }

  /**
   * Create new channel
   * @param  {string} channel Channel name
   */
  function createChannel(channel) {
    if (channels[channel]) return channelAlreadyExistWarning(channel);
    channels[channel] = [];
  }

  /**
   * Destroy channel by it's name
   * @param  {string} channel Channel name
   */
  function destroyChannel(channel) {
    if (!channels[channel]) return channelDoesntExistWarning(channel);
    delete channels[channel];
  }

  /**
   * Returns standalone channel object
   * @param  {string}  channel Channel name
   * @return {Channel}         Channel
   */
  function getChannel(channel) {
    return {
      /**
       * Subscribe callback to channel
       * @param  {Function} callback Callback to call
       * @return {string}            Subscriber ident
       */
      subscribe: function(callback) {
        return subscribe(channel, callback);
      },

      /**
       * Unsubscribe callback from channel
       * @param  {string} subscriberIdent Subscriber ident
       */
      unsubscribe: function(subscriberIdent) {
        unsubscribe(channel, subscriberIdent);
      },

      /**
       * Publih data to channel
       * @param  {any} data Data to pass to subscribers
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

  /**
   * Subscribe callback to channel
   * @param  {string}   channel  Cahnnel name
   * @param  {Function} callback Callback to call
   * @return {string}            Subscriber ident
   */
  function subscribe(channel, callback) {
    if (!channels[channel]) return channelDoesntExistWarning(channel);
    var subscriberIdent = identSequence.next();
    var subscriberObject = {
      ident: subscriberIdent,
      callback: callback
    };
    channels[channel].push(subscriberObject);
    return subscriberIdent;
  }

  /**
   * Unsubscribe callback from channel
   * @param  {string} channel         Channel name
   * @param  {string} subscriberIdent Subscriber ident
   */
  function unsubscribe(channel, subscriberIdent) {
    if (!channels[channel]) return channelDoesntExistWarning(channel);
    channels[channel].filter(function (subscriberObject) {
      return subscriberObject.ident != subscriberIdent;
    });
  }

  /**
   * Publish data to channel
   * @param  {string} channel Channel name
   * @param  {any} data       Data to pass to subscribers
   */
  function publish(channel, data) {
    if (!channels[channel]) return channelDoesntExistWarning(channel);
    var subscribers = channels[channel];
    var callbacks = subscribers.map(function(subscriberObject) {
      return subscriberObject.callback;
    });
    callbacks.forEach(function(cb) {
      cb(data);
    });
  }

  return {
    createChannel: createChannel,
    destroyChannel: destroyChannel,
    getChannel: getChannel,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    publish: publish
  };
})();

if (module) {
  module.exports = channelDispatcher;
}
