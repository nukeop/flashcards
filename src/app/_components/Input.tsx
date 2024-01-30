import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const input = cva(
    'flex-grow rounded border-none bg-transparent p-0.5 outline-none',
    {
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
    },
);

const inputFrame = cva(
    'flex h-full w-full flex-row rounded bg-stone-200 px-4 py-2 focus-within:shadow-inner',
    {
        variants: {
            borderless: {
                true: 'border-none',
            },
        },
    },
);

type InputProps<T extends React.ElementType> = Omit<
    React.ComponentPropsWithoutRef<T>,
    'prefix' | 'as' | 'className' | 'id'
> &
    VariantProps<typeof input> &
    VariantProps<typeof inputFrame> & {
        classes?: Partial<{
            input: string;
            inputFrame: string;
            root: string;
        }>;
        id?: string;
        prefix?: React.ReactElement;
        label?: string;
        as?: T;
    };

function Input<T extends React.ElementType>({
    id,
    error,
    prefix,
    textSize,
    label,
    borderless,
    classes,
    as,
    ...props
}: InputProps<T>) {
    const Component = as || 'input';
    return (
        <div className={clsx('group w-full text-sm', classes?.root)}>
            <label className="block h-full w-full cursor-text rounded text-sm font-medium">
                {label && (
                    <div className="mb-1 flex cursor-default flex-row items-center justify-start">
                        <span>{label}</span>
                    </div>
                )}
                <div
                    className={clsx(
                        inputFrame({ borderless }),
                        classes?.inputFrame,
                    )}
                >
                    {prefix && (
                        <div className="mr-2 flex flex-row items-center justify-start text-stone-400 group-focus-within:text-stone-600 group-active:text-stone-600">
                            {prefix}
                        </div>
                    )}
                    <Component
                        id={id}
                        name={id}
                        className={clsx(
                            input({ error, textSize }),
                            classes?.input,
                        )}
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
}

export default Input;
