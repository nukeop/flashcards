import { VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';

const panel = cva('bg-surface border border-accent/25 rounded-lg mb-4', {
    variants: {
        padding: {
            none: 'p-0',
            sm: 'p-2',
        },
        layout: {
            row: 'flex flex-row items-center',
            col: 'flex flex-col',
        },
    },
    defaultVariants: {
        padding: 'sm',
    },
});

type PanelProps = {
    children?: React.ReactNode;
    className?: string;
} & VariantProps<typeof panel>;

const Panel: React.FC<PanelProps> = ({
    children,
    className,
    padding,
    layout,
}: PanelProps) => {
    return (
        <div className={clsx(panel({ padding, layout }), className)}>
            {children}
        </div>
    );
};

export default Panel;
