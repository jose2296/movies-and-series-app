import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
// import { useTranslation } from 'react-i18next';

interface InputProps {
    type?: 'text' | 'password';
    placeholder: string;
    register: UseFormRegisterReturn<string>
    errors: FieldError | undefined;
}

const Input = ({ type = 'text', placeholder, register, errors }: InputProps) => {
    // const { t } = useTranslation();

    return (
        <label className='form-control w-full max-w-xs mb-5'>
            <div className='label'>
                <span className='label-text'>{placeholder}</span>
            </div>
            <input type={type} placeholder={placeholder} className='input input-bordered w-full max-w-xs focus:outline-none' {...register} />
            <div className='label'>
                { errors &&
                    errors.type === 'required' && <span className='label-text-alt text-error'>{'Este campo es requerido'}</span>
                }
                { errors &&
                    errors?.type === 'custom' && <span className='label-text-alt text-error'>{errors?.message as string}</span>
                }
                {/* <span className='label-text-alt'>Bottom Right label</span> */}
            </div>
        </label>
    );
};

export default Input;
