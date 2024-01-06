import { cva } from 'class-variance-authority';

type ButtonProps = {
    children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const button = cva(
    'rounded-lg hover:bg-overlay-contrast active:bg-overlay-contrast/75 p-2',
    {
        variants: {},
    },
);

const Button: React.FC<ButtonProps> = ({ children, ...rest }: ButtonProps) => {
    return (
        <button className={button()} {...rest}>
            {children}
        </button>
    );
};

export default Button;
