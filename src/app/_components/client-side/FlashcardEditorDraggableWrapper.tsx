import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type FlashcardEditorDraggableWrapperProps = {
    children: ({ isDragging }: { isDragging: boolean }) => React.ReactNode;
    id: string;
};

const FlashcardEditorDraggableWrapper: React.FC<
    FlashcardEditorDraggableWrapperProps
> = ({ children, id }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id,
    });
    const style = { transform: CSS.Translate.toString(transform), transition };

    return (
        <div
            className={clsx('relative flex transform-gpu', {
                'z-10': isDragging,
            })}
            style={style}
            ref={setNodeRef}
            {...attributes}
        >
            <div
                className="absolute bottom-0 left-0 top-0 z-10 flex cursor-grab items-center rounded-l-lg px-1 hover:bg-stone-200"
                {...listeners}
            >
                <Bars3Icon className="h-4 w-4 rotate-90" />
            </div>
            {children({ isDragging })}
        </div>
    );
};

export default FlashcardEditorDraggableWrapper;
