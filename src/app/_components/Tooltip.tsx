import { VariantProps, cva } from 'class-variance-authority';

const tooltip = cva(
    'absolute z-20 bg-base rounded-md p-2 shadow-smooth border border-subtle text-xs hidden group-hover:block whitespace-nowrap',
    {
        variants: {
            placement: {
                top: 'bottom-full mb-1',
                bottom: 'top-full mt-1',
                left: 'left-full mr-1',
                right: 'right-full ml-1',
            },
        },
    },
);

type TooltipProps = {
    content: React.ReactElement | string | null;
    children: React.ReactNode;
} & VariantProps<typeof tooltip>;

const Tooltip: React.FC<TooltipProps> = ({ content, children, placement }) => {
    return (
        <div className="relative group flex justify-center">
            <div className={tooltip({ placement })}>{content}</div>
            {children}
        </div>
    );
};

export default Tooltip;
