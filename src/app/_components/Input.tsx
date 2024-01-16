import { VariantProps, cva } from 'class-variance-authority';

const input = cva('p-0.5 outline-none bg-transparent border-none flex-grow', {
    variants: {
        error: {
            true: 'border-theme-red',
        },
        textSize: {
            sm: 'text-sm',
            md: 'text-md',
            lg: 'text-lg',
        },
    },
});

type InputProps = Omit<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
    'prefix'
> &
    VariantProps<typeof input> & {
        prefix?: React.ReactElement;
        label?: string;
    };

const Input: React.FC<InputProps> = ({
    error,
    prefix,
    textSize,
    label,
    ...props
}: InputProps) => {
    return (
        <div className="w-full text-sm">
            <label className="block text-sm font-medium text-text rounded  cursor-text">
                {label && (
                    <div className="flex flex-row justify-start items-center cursor-default mb-1">
                        <span>{label}</span>
                    </div>
                )}
                <div
                    className={
                        'flex flex-row border border-muted [&:not(focus)]:hover:border-subtle focus-within:border-accent px-2 py-0.5 rounded'
                    }
                >
                    {prefix && (
                        <div className="flex flex-row items-center justify-start mr-2">
                            {prefix}
                        </div>
                    )}
                    <input
                        className={input({ error, textSize })}
                        aria-invalid={!!error}
                        {...props}
                    />
                    {error && (
                        <p className="mt-2 text-sm text-error" id="email-error">
                            {error}
                        </p>
                    )}
                </div>
            </label>
        </div>
    );
};

export default Input;
