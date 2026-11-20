import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Connection to Laravel Reverb. Channels are added where needed via this.$echo
export default ({ $config, $axios }, inject) => {
  const { key, host, port, scheme } = $config.reverb;

  window.Pusher = Pusher;

  const echo = new Echo({
    broadcaster: 'reverb',
    key,
    wsHost: host,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    // Private channels are authorized through $axios so the current Bearer token is attached
    authorizer: channel => ({
      authorize: (socketId, callback) => {
        $axios.$post('broadcasting/auth', { socket_id: socketId, channel_name: channel.name })
          .then(data => callback(null, data))
          .catch(error => callback(error, null));
      },
    }),
  });

  inject('echo', echo);
};
