import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useStore from './store';

const firebaseConfig = {
    apiKey: 'AIzaSyDBINVo16FMd_AfWBg0EnaFRAc5mjzAE_g',
    authDomain: 'lists-fa5ab.firebaseapp.com',
    databaseURL: 'https://lists-fa5ab-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'lists-fa5ab',
    storageBucket: 'lists-fa5ab.appspot.com',
    messagingSenderId: '262332809341',
    appId: '1:262332809341:web:562be1af757f31cebbf114'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Auth = () => {
    const seUid = useStore((state) => state.setUid);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTheme();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                seUid(user.uid);
                navigate(pathname !== '/' ? pathname : 'app');
            } else {
                navigate('login');
            }

            setLoading(false);
        });
    }, []);


    const getTheme = () => {
        const localTheme = localStorage.getItem('theme');

        if (localTheme) {
            document.querySelector('html')?.setAttribute('data-theme', localTheme);
        } else {
            const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'custom';
            document.querySelector('html')?.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    };

    return loading ? <></> : <Outlet />;
};

export default Auth;
