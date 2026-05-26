import '../css/app.css';
import { store } from '@/store'
import { Provider } from 'react-redux'
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const pages = import.meta.glob('./pages/**/*.{tsx,jsx}');

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
   resolve: (name) => {
        const page = pages[`./pages/${name}.tsx`] ?? pages[`./pages/${name}.jsx`];

        if (!page) {
            throw new Error(`Page not found: ./pages/${name}.tsx or ./pages/${name}.jsx`);
        }

        return page();
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
 <Provider store={store}>
        <App {...props} />
            </Provider>
    );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
