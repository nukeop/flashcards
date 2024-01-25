import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const button = cva(
    'flex flex-row items-center justify-center rounded-lg py-2 text-sm font-bold',
    {
        variants: {
            intent: {
                primary: 'bg-accent px-6 text-surface',
                secondary: 'bg-transparent px-6 text-accent',
                green: 'ring-inner bg-green-500 px-6 text-white hover:bg-green-400 active:bg-green-400',
                sidebar:
                    'px-2 hover:bg-overlay-contrast active:bg-muted-contrast/25 ',
                topbar: 'px-2 hover:bg-indigo-500 active:bg-indigo-400',
                breadcrumbs:
                    'px-2 hover:bg-white hover:shadow active:bg-white active:shadow',
                basic: 'border border-muted/75 bg-base px-2 hover:bg-overlay',
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
} & VariantProps<typeof button> &
    Omit<React.ComponentProps<T>, 'as' | 'className'>;

function Button<T extends React.ElementType>({
    children,
    className,
    intent,
    isLoading,
    as,
    ...rest
}: ButtonProps<T>) {
    const Component = as || 'button';
    return (
        <Component
            className={clsx(button({ intent, isLoading }), className)}
            {...rest}
        >
            {isLoading && (
                <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-surface"
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
}

export default Button;
