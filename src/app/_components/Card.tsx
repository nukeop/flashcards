import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const card = cva(
    'transition-box-shadow relative flex w-96 transform-gpu flex-row overflow-hidden rounded-lg border border-stone-200 bg-stone-50 shadow-smooth-low duration-500 ease-in-out hover:shadow-smooth',
    {
        variants: {
            transparent: {
                true: 'border border-muted/75 bg-surface/50 backdrop-blur-md',
            },
            hoverEffect: {
                true: 'hover:bg-stone-50',
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
            dark: 'bg-stone-500',
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
