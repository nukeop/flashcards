import { FC } from 'react';

// This component is necessary because of the typing of ContextMenuItemProps
const ContextMenuIconWrapper = (Icon: FC<{ className?: string }>) => {
    const wrappedIcon = ({ className }: { className?: string }) => (
        <Icon className={className} />
    );

    wrappedIcon.displayName =
        'ContextMenuIconWrapper(' + (Icon.displayName || Icon.name) + ')';

    return wrappedIcon;
};

export default ContextMenuIconWrapper;
