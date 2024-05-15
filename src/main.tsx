import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.tsx';
import Auth from './Auth.tsx';
import './index.css';
import Login from './login.tsx';
import Register from './register.tsx';

const router = createBrowserRouter([
    {
        path: '',
        element: <Auth />,
        children: [
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/app',
                element: <>
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
                </>,
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
