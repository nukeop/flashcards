import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const card = cva(
    'transition-box-shadow relative flex w-96 transform-gpu flex-row overflow-hidden rounded-lg border border-muted/75 bg-surface shadow-smooth duration-500 ease-in-out hover:shadow-smooth-high',
    {
        variants: {
            transparent: {
                true: 'border border-muted/75 bg-surface/50 backdrop-blur-md',
            },
            hoverEffect: {
                true: 'hover:bg-overlay',
            },
            layout: {
                centered: 'flex flex-col items-center justify-center',
            },
            fluid: {
                true: 'w-full',
            },
        },
    },
);

const accentBar = cva('relative w-3 flex-shrink-0 flex-grow-0', {
    variants: {
        accent: {
            greenblue: 'bg-gradient-to-t from-green-400 to-blue-500',
            violetpink: 'bg-gradient-to-t from-purple-400 to-pink-500',
        },
    },
});

type CardProps = {
    children?: React.ReactNode;
    className?: string;
} & VariantProps<typeof card> &
    VariantProps<typeof accentBar>;

const Card: React.FC<CardProps> = ({
    children,
    className,
    transparent,
    layout,
    fluid,
    accent,
}: CardProps) => {
    return (
        <section
            className={clsx(card({ transparent, layout, fluid }), className)}
        >
            {accent && <div className={accentBar({ accent })} />}
            <div className="relative flex flex-col truncate p-4">
                {children}
            </div>
        </section>
    );
};

export default Card;
