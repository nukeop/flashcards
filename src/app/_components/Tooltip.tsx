import { cva, VariantProps } from 'class-variance-authority';

const tooltip = cva(
    'absolute z-20 hidden w-36 whitespace-normal text-wrap rounded-md border border-stone-600 bg-stone-800 px-2 py-1 text-xs text-stone-200 shadow-smooth-low group-hover:block',
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

export type TooltipProps = {
    content: React.ReactElement | string | null;
    children: React.ReactNode;
} & VariantProps<typeof tooltip>;

const Tooltip: React.FC<TooltipProps> = ({ content, children, placement }) => {
    return (
        <div className="group relative flex justify-center">
            <div className={tooltip({ placement })}>{content}</div>
            {children}
        </div>
    );
};

export default Tooltip;
