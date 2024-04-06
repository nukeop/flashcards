type SidebarHeaderProps = {
    children: React.ReactNode;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ children }) => {
    return (
        <div className="mb-1 flex items-center justify-between rounded px-2 py-1 text-sm font-bold uppercase text-stone-300">
            {children}
        </div>
    );
};

export default SidebarHeader;
