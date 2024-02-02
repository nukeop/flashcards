import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MouseEventHandler } from 'react';
import ContextMenu from './ContextMenu/ContextMenu';
import ContextMenuIconWrapper from './ContextMenu/ContextMenuIconWrapper';

type FlashcardContextMenuProps = {
    onEdit: MouseEventHandler;
    onDelete: MouseEventHandler;
};

const FlashcardContextMenu: React.FC<FlashcardContextMenuProps> = ({
    onEdit,
    onDelete,
}) => {
    return (
        <ContextMenu
            items={[
                {
                    label: 'Edit',
                    Icon: ContextMenuIconWrapper(PencilSquareIcon),
                    onClick: onEdit,
                },
                {
                    label: 'Delete',
                    Icon: ContextMenuIconWrapper(TrashIcon),
                    intent: 'warning',
                    onClick: onDelete,
                },
            ]}
        />
    );
};

export default FlashcardContextMenu;
