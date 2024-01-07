type TooltipProps = {
    content: React.ReactElement | null;
    children: React.ReactNode;
};

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
    return (
        <div className="relative group">
            <div
                className="absolute left-full z-10 hidden group-hover:block bg-base-contrast text-base rounded-md p-2 shadow-lg border border-subtle
            "
            >
                {content}
            </div>
            {children}
        </div>
    );
};

export default Tooltip;
