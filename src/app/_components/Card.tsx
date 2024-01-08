import { VariantProps, cva } from 'class-variance-authority';

const card = cva('bg-surface border-1 rounded-lg p-4 w-96 shadow-lg', {
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
});

type CardProps = {
    children?: React.ReactNode;
} & VariantProps<typeof card>;

const Card: React.FC<CardProps> = ({
    children,
    transparent,
    layout,
    fluid,
}: CardProps) => {
    return (
        <section className={card({ transparent, layout, fluid })}>
            {children}
        </section>
    );
};

export default Card;
