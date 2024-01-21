import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const panel = cva('mb-4 rounded-lg border border-muted/25 bg-surface', {
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
