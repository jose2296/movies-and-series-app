import { ButtonHTMLAttributes, HTMLAttributes, ReactElement } from 'react';

interface props {
    type?: 'normal' | 'btn-primary' | 'btn-secondary' | 'btn-accent' | 'btn-neutral' | 'btn-ghost' | 'btn-link' | 'btn-success';
    circle?: boolean;
    // type?: 'normal' | 'primary' | 'secondary' | 'accent' | 'neutral' | 'ghost' | 'link';
    text?: string;
    nativeType?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    className?: HTMLAttributes<HTMLElement>['className'];
    icon?: ReactElement;
    linksTo?: string;
    click?: () => void;
    loading?: boolean;
    disabled?: boolean;
    disabledToolTip?: string;
}

const Button = ({ type = 'btn-secondary', circle, nativeType, text, className, icon, click, loading, disabled, disabledToolTip }: props) => {

    return (
        <button
            onClick={click}
            className={`btn ${type === 'normal' ? '' : type} ${circle ? 'btn-circle' : ''} ${className || ''} ${disabled ? 'tooltip tooltip-bottom' : ''} disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-auto`}
            disabled={disabled}
            data-tip={disabled ? disabledToolTip || '' : ''}
            type={nativeType || 'submit'}
        >
            {text && text}
            {icon && (
                <div className={`icon w-4 ${text ? 'ml-1' : ''}`}>
                    {icon}
                </div>
            )}
            {loading && <span className='loading loading-spinner' />}
        </button>
    );
};

export default Button;
