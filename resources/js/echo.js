import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const reverbAppKey = import.meta.env.VITE_REVERB_APP_KEY;
const broadcastingEnabled = Boolean(reverbAppKey);

window.Pusher = Pusher;

let echo = null;

if (broadcastingEnabled) {
    echo = new Echo({
        broadcaster: 'reverb',
        key: reverbAppKey,
        wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: '/broadcasting/auth',
        auth: {
            // headers: {
            //     'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            // },
        },
    });
}

window.Echo = echo;
export default echo;
