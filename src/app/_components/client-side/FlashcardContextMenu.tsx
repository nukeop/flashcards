import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MouseEventHandler, useMemo } from 'react';
import ContextMenu from './ContextMenu/ContextMenu';
import ContextMenuIconWrapper from './ContextMenu/ContextMenuIconWrapper';

type FlashcardContextMenuProps = {
    onEdit?: MouseEventHandler;
    onDelete?: MouseEventHandler;
};

const filterNonUndefined = <T,>(arr: (T | undefined)[]) => {
    return arr.filter(Boolean) as T[];
};

const FlashcardContextMenu: React.FC<FlashcardContextMenuProps> = ({
    onEdit,
    onDelete,
}) => {
    const items = useMemo(
        () =>
            filterNonUndefined([
                onEdit && {
                    label: 'Edit',
                    Icon: ContextMenuIconWrapper(PencilSquareIcon),
                    onClick: onEdit,
                },
                onDelete && {
                    label: 'Delete',
                    Icon: ContextMenuIconWrapper(TrashIcon),
                    intent: 'warning' as const,
                    onClick: onDelete,
                },
            ]),
        [onEdit, onDelete],
    );
    return <ContextMenu items={items} />;
};

export default FlashcardContextMenu;
