import { cva } from 'class-variance-authority';

type InputProps = Omit<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
    'prefix'
> & {
    error?: string;
    prefix?: React.ReactElement;
};

const Input: React.FC<InputProps> = ({
    error,
    prefix,
    ...props
}: InputProps) => {
    const input = cva(
        'p-0.5 outline-none bg-transparent border-none flex-grow',
        {
            variants: {
                error: {
                    true: 'border-theme-red',
                },
            },
        },
    );

    return (
        <div className="w-full text-sm">
            <label className="block text-sm font-medium text-text rounded border border-muted px-2 py-0.5 [&:not(focus)]:hover:border-subtle focus-within:border-accent cursor-text">
                <div className={'flex flex-row'}>
                    {prefix && (
                        <div className="flex flex-row items-center justify-start mr-2">
                            {prefix}
                        </div>
                    )}
                    <input
                        className={input({ error: !!error })}
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
