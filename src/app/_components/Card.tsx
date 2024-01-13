import { VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';

const card = cva(
    'relative flex flex-row bg-surface border border-accent/25 rounded-lg w-96 drop-shadow-lg hover:drop-shadow-xl transition-shadow transform-gpu duration-200 ease-in-out overflow-hidden hover:bg-overlay',
    {
        variants: {
            transparent: {
                true: 'border border-muted/50 bg-surface/50 backdrop-blur-md',
            },
            layout: {
                centered: 'flex flex-col justify-center items-center',
            },
            fluid: {
                true: 'w-full',
            },
        },
    },
);

const accentBar = cva('relative flex-grow-0 flex-shrink-0 w-3', {
    variants: {
        accent: {
            greenblue: 'from-green-400 to-blue-500 bg-gradient-to-t',
            violetpink: 'from-purple-400 to-pink-500 bg-gradient-to-t',
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
            <div className="flex-grow p-4">{children}</div>
        </section>
    );
};

export default Card;
