import { useDroppable } from '@dnd-kit/core';

type FlashcardEditorDroppableAreaProps = {
    children: React.ReactNode;
};

const FlashcardEditorDroppableArea: React.FC<
    FlashcardEditorDroppableAreaProps
> = ({ children }) => {
    const { setNodeRef } = useDroppable({
        id: 'droppable',
    });

    return (
        <div className="flex flex-auto flex-col" ref={setNodeRef}>
            {children}
        </div>
    );
};

export default FlashcardEditorDroppableArea;
