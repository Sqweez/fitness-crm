import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Connection to Laravel Reverb. Nothing subscribes yet: channels are added where needed via this.$echo
export default ({ $config }, inject) => {
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
  });

  inject('echo', echo);
};
