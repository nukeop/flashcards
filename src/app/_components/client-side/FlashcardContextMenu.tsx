import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MouseEventHandler } from 'react';
import ContextMenu from './ContextMenu/ContextMenu';

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
            onClose={() => {}}
            items={[
                {
                    label: 'Edit',
                    icon: <PencilSquareIcon className="h-4 w-4" />,
                    onClick: onEdit,
                },
                {
                    label: 'Delete',
                    icon: <TrashIcon className="h-4 w-4" />,
                    intent: 'warning',
                    onClick: onDelete,
                },
            ]}
        />
    );
};

export default FlashcardContextMenu;
