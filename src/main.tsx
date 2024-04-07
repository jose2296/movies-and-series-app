import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
        <Toaster toastOptions={{
            classNames: {
                error: 'bg-error border-error',
                success: 'bg-success border-success',
                warning: 'text-yellow-400',
                info: 'bg-blue-400',
                closeButton: 'bg-base-content text-base-200 right-0 left-[98%]'
            },
            closeButton: true,
            duration: 3000
        }} />
    </React.StrictMode>,
);
