import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { forwardRef, LegacyRef } from 'react';

const button = cva(
    'flex flex-row items-center justify-center rounded-lg py-2 text-sm font-bold',
    {
        variants: {
            intent: {
                primary:
                    'bg-stone-500 px-6 text-stone-50 hover:bg-stone-400 active:bg-stone-400',
                green: 'bg-green-500 px-6 text-stone-50 hover:bg-green-400 active:bg-green-400',
                topbar: 'px-2 hover:bg-stone-700 active:bg-stone-800/75',
                breadcrumbs:
                    'px-2 hover:bg-white hover:shadow active:bg-white active:shadow',
                text: 'bg-transparent px-4 hover:bg-stone-200 active:bg-stone-300',
                basic: 'border border-stone-300 bg-stone-50 px-2 hover:bg-stone-100',
                transparent: 'bg-transparent px-2 hover:bg-stone-100',
                iconButton:
                    'flex flex-row justify-between gap-2 px-2 text-stone-500 hover:bg-stone-200 active:bg-stone-200',
            },
            isLoading: {
                true: 'cursor-not-allowed',
            },
        },
    },
);

type ButtonProps<T extends React.ElementType> = {
    children?: React.ReactNode;
    className?: string;
    as?: T;
    ref?: LegacyRef<T>;
} & VariantProps<typeof button> &
    Omit<React.ComponentProps<T>, 'as' | 'className'>;

const Button = forwardRef(
    <T extends React.ElementType = 'button'>(
        { children, className, intent, isLoading, as, ...rest }: ButtonProps<T>,
        ref: React.Ref<T>,
    ) => {
        const Component = as || 'button';

        return (
            <Component
                ref={ref}
                className={clsx(button({ intent, isLoading }), className)}
                {...rest}
            >
                {isLoading && (
                    <svg
                        className="text-surface -ml-1 mr-3 h-5 w-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                    </svg>
                )}
                {children}
            </Component>
        );
    },
);

Button.displayName = 'Button';

export default Button;
