import Pusher from 'pusher-js';
import Pako from 'pako';
import config from '../config';

class PusherService {
  constructor () {
    this._pusher = null;
    this._subscribedChannels = {};
  }

  init (key, cluster) {
    if (key && cluster) {
      this._pusher = new Pusher(key, {
        cluster: cluster,
        useTLS: config.pusher.ssl
      });
    }
  }

  get isActive () {
    return this._pusher;
  }

  publish (channelName, eventName, message, cb) {
    if (this._pusher && channelName && eventName && message) {
      let type = 'S';
      if (typeof message === 'object') {
        message = JSON.stringify(message);
        type = 'O';
      }
      const deflatedMessageBytes = Pako.deflate(type + message, { to: 'string' });
      const base64DeflatedMessage = Buffer.from(deflatedMessageBytes).toString('base64');

      return this._pusher.trigger(channelName, eventName, base64DeflatedMessage, null, cb);
    }
  }

  subscribe (channelName, callback) {
    if (this._pusher && !(channelName in this._subscribedChannels)) {
      this._subscribedChannels[channelName] = callback;

      const channel = this._pusher.subscribe(channelName);
      channel.bind_global((context, encodedData) => {
        if (context.indexOf('pusher:') === -1) {
          const payloadBuffer = Buffer.from(encodedData, 'base64').toString();
          const payloadInflated = Pako.inflate(payloadBuffer, { to: 'string' });
          let result = null;

          if (payloadInflated[0] === 'O') {
            result = JSON.parse(payloadInflated.substring(1));
          } else {
            result = payloadInflated.substring(1);
          }

          if (this._subscribedChannels[channelName]) {
            this._subscribedChannels[channelName](context, result);
          }
        } else {
          if (this._subscribedChannels[channelName]) {
            this._subscribedChannels[channelName](context, encodedData);
          }
        }
      });
    }
  }

  unsubscribe (channelName) {
    if (this._pusher && channelName && (channelName in this._subscribedChannels)) {
      this._pusher.unsubscribe(channelName);
      delete this._subscribedChannels[channelName];
    }
  }
}

export default new PusherService();
