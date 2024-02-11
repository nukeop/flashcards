import { useDroppable } from '@dnd-kit/core';

type FlashcardEditorDroppableAreaProps = {
    children: React.ReactNode;
};

const FlashcardEditorDroppableArea: React.FC<
    FlashcardEditorDroppableAreaProps
> = ({ children }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'droppable',
    });

    return <div ref={setNodeRef}>{children}</div>;
};

export default FlashcardEditorDroppableArea;
