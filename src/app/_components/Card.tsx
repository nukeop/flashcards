import { VariantProps, cva } from 'class-variance-authority';

const card = cva('bg-surface border-1 rounded-lg p-4 w-96', {
    variants: {
        transparency: {
            transparent:
                'border border-muted/50 bg-surface/50 backdrop-blur-md',
        },
        layout: {
            centered: 'flex flex-col justify-center items-center',
        },
    },
});

type CardProps = {
    children?: React.ReactNode;
} & VariantProps<typeof card>;

const Card: React.FC<CardProps> = ({
    children,
    transparency,
    layout,
}: CardProps) => {
    return (
        <section className={card({ transparency, layout })}>{children}</section>
    );
};

export default Card;
