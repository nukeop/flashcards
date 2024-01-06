import { VariantProps, cva } from 'class-variance-authority';

const button = cva('flex flex-row rounded-lg py-2 text-sm font-bold', {
    variants: {
        intent: {
            primary: 'bg-accent text-surface px-6',
            secondary: 'bg-transparent text-accent px-6',
            sidebar:
                'px-2 hover:bg-overlay-contrast active:bg-muted-contrast/25 ',
        },
        isLoading: {
            true: 'cursor-not-allowed',
        },
    },
});

type ButtonProps = {
    children?: React.ReactNode;
} & VariantProps<typeof button> &
    React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
    children,
    intent,
    isLoading,
    ...rest
}: ButtonProps) => {
    return (
        <button className={button({ intent, isLoading })} {...rest}>
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-surface"
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
        </button>
    );
};

export default Button;
