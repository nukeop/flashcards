import { Database } from '@/app/_lib/database.types';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';

type Flashcard = Database['public']['Tables']['flashcards']['Row'];

type FlashcardEditorTableProps = {
    flashcards: Flashcard[];
};

enum FlashcardEditorTableColumn {
    Front = 'front',
    Back = 'back',
}

const FlashcardEditorTable: React.FC<FlashcardEditorTableProps> = ({
    flashcards,
}) => {
    const columns = useMemo(
        () => [
            {
                id: FlashcardEditorTableColumn.Front,
                Header: 'Front',
                accessor: 'front',
            },
            {
                id: FlashcardEditorTableColumn.Back,
                Header: 'Back',
                accessor: 'back',
            },
        ],
        [],
    );
    const data = useMemo(() => flashcards, [flashcards]);
    const { rows } = useReactTable<Flashcard>({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
    });
    return (
        <div>
            {rows.map((row) => {
                return (
                    <div
                        key={row.id}
                        className="flex flex-row items-center justify-between"
                    >
                        {row.cells.map((cell) => {
                            return <div>{cell.value}</div>;
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default FlashcardEditorTable;
