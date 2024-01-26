import { cva, VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const panel = cva(
    'mb-4 rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-200 ease-in-out',
    {
        variants: {
            padding: {
                none: 'p-0',
                sm: 'p-2',
            },
            layout: {
                row: 'flex flex-row items-center',
                col: 'flex flex-col',
            },
            border: {
                none: 'border-none',
            },
            hoverEffect: {
                true: 'hover:bg-slate-100 hover:shadow-smooth-low',
            },
        },
        defaultVariants: {
            padding: 'sm',
        },
    },
);

type PanelProps<T extends React.ElementType> = {
    children?: React.ReactNode;
    className?: string;
    as?: T;
} & VariantProps<typeof panel> &
    Omit<React.ComponentProps<T>, 'as' | 'className'>;

function Panel<T extends React.ElementType>({
    children,
    className,
    padding,
    layout,
    border,
    hoverEffect,
    as,
    ...rest
}: PanelProps<T>) {
    const Component = as || 'div';
    return (
        <Component
            className={clsx(
                panel({ padding, layout, border, hoverEffect }),
                className,
            )}
            {...rest}
        >
            {children}
        </Component>
    );
}

export default Panel;
