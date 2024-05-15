import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from './components/button';
import Input from './components/input';
import useStore from './store';

interface FormFields {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();

    const setUserUid = useStore((state) => state.setUid);
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const signIn = ({ email, password }: FormFields) => {
        setLoading(true);
        setErrorMessage(null);
        const auth = getAuth();
        setPersistence(auth, browserLocalPersistence)
            .then(() => {
                return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                    const uid = userCredential.user.uid;
                    setUserUid(uid);
                    setLoading(false);
                    navigate('/app');
                })
                    .catch((error) => {

                        if (error.code === 'auth/invalid-login-credentials' || error.code === 'auth/invalid-credential') {
                            setErrorMessage('Credenciales incorrectas');
                        }
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    return (
        <div className='flex justify-center'>
            <div className='h-[100vh] flex flex-col max-w-sm items-center justify-center'>
                <form onSubmit={handleSubmit(signIn)} className='flex flex-col max-w-sm items-center justify-center rounded-xl border-2 p-12 border-neutral prose'>
                    <h1 className='pb-4 text-xl font-bold'>Inicia sesión</h1>
                    <Input placeholder='Email' register={register('email', { required: true })} errors={errors.email} />
                    <Input type='password' placeholder='Contraseña' register={register('password', { required: true })} errors={errors.password} />
                    <Button text='Iniciar sesión' type='btn-neutral' loading={loading} />

                    {errorMessage &&
                        <span className='text-error mt-4'>{errorMessage}</span>
                    }
                    <div className='pt-6'>
                        <Button text='Regístrate' type='btn-ghost' click={() => navigate('/register')} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
