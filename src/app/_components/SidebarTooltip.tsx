type TooltipProps = {
    content: React.ReactElement | string | null;
    children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    return (
        <div className="relative group">
            <div className="absolute top-1/2 left-full z-10 bg-base-contrast rounded-md p-2 shadow-lg border border-subtle text-xs -translate-y-1/2 hidden group-hover:block ml-3">
                {content}
            </div>
            {children}
        </div>
    );
};

export default Tooltip;
