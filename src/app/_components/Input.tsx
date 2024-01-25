import { cva, VariantProps } from 'class-variance-authority';

const input = cva('flex-grow border-none bg-transparent p-0.5 outline-none', {
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

const inputFrame = cva(
    'flex flex-row rounded border border-slate-400 px-2 py-0.5 focus-within:border-indigo-600 [&:not(focus)]:hover:border-slate-700',
    {
        variants: {
            borderless: {
                true: 'border-none',
            },
        },
    },
);

type InputProps = Omit<
    React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
    'prefix'
> &
    VariantProps<typeof input> &
    VariantProps<typeof inputFrame> & {
        prefix?: React.ReactElement;
        label?: string;
    };

const Input: React.FC<InputProps> = ({
    error,
    prefix,
    textSize,
    label,
    borderless,
    ...props
}: InputProps) => {
    return (
        <div className="w-full text-sm">
            <label className="block cursor-text rounded text-sm font-medium">
                {label && (
                    <div className="mb-1 flex cursor-default flex-row items-center justify-start">
                        <span>{label}</span>
                    </div>
                )}
                <div className={inputFrame({ borderless })}>
                    {prefix && (
                        <div className="mr-2 flex flex-row items-center justify-start">
                            {prefix}
                        </div>
                    )}
                    <input
                        className={input({ error, textSize })}
                        aria-invalid={!!error}
                        {...props}
                    />
                    {error && (
                        <p className="text-error mt-2 text-sm">{error}</p>
                    )}
                </div>
            </label>
        </div>
    );
};

export default Input;
