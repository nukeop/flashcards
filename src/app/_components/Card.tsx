import { VariantProps, cva } from 'class-variance-authority';

const card = cva('bg-surface border-1 rounded-lg p-24', {
    variants: {
        transparency: {
            transparent:
                'border border-muted/50 bg-surface/50 backdrop-blur-md',
        },
    },
});

type CardProps = {
    children?: React.ReactNode;
} & VariantProps<typeof card>;

const Card: React.FC<CardProps> = ({ children, transparency }: CardProps) => {
    return <section className={card({ transparency })}>{children}</section>;
};

export default Card;
