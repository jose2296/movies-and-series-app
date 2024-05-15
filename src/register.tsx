import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from './components/button';
import Input from './components/input';

interface FormFields {
    email: string;
    password: string;
}

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormFields>();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const signUp = ({ email, password }: FormFields) => {
        setLoading(true);
        setErrorMessage(null);
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                setLoading(false);
            })
            .catch((error) => {
                const errorCode = error.code;

                if (errorCode === 'auth/email-already-in-use') {
                    setErrorMessage('El email ya existe');
                }
                setLoading(false);
            });
    };

    return (
        <div className='flex justify-center'>
            <div className='h-[100vh] flex flex-col max-w-sm items-center justify-center'>
                <form onSubmit={handleSubmit(signUp)} className='flex flex-col max-w-sm items-center justify-center rounded-xl border-2 p-12 border-neutral prose'>
                    <h1 className='pb-4 text-xl font-bold'>Registro</h1>
                    <Input placeholder='Email' register={register('email', { required: true })} errors={errors.email} />
                    <Input type='password' placeholder='Contraseña' register={register('password', { required: true })} errors={errors.password} />
                    <Button text='Enviar' type='btn-neutral' loading={loading} />

                    {errorMessage &&
                        <span className='text-error mt-4'>{errorMessage}</span>
                    }
                    <div className='pt-6'>
                        <Button text='Iniciar sesión' type='btn-ghost' click={() => navigate('/login')} />
                    </div>
                </form>
            </div>
        </div>

    );
};

export default Register;
