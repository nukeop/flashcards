'use client';

import { DeckCardView } from '@/app/_lib/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import Button from '../Button';
import Flashcard from '../Flashcard';
import AddFlashcardDialog from './AddFlashcardDialog';
import styles from './FlashcardEditorGrid.module.scss';

type FlashcardEditorGridProps = {
    cards: DeckCardView[];
    onCreateFlashcard: (formData: FormData) => void;
};

const FlashcardEditorGrid: React.FC<FlashcardEditorGridProps> = ({
    cards,
    onCreateFlashcard,
}) => {
    const [isAddCardDialogOpen, setAddCardDialogOpen] = useState(false);

    return (
        <div
            className={clsx(
                'grid w-full gap-4',
                styles['flashcard-grid-container'],
            )}
        >
            <AddFlashcardDialog
                isOpen={isAddCardDialogOpen}
                onCancel={() => setAddCardDialogOpen(false)}
                onClose={() => setAddCardDialogOpen(false)}
                onCreateFlashcard={(formData: FormData) => {
                    onCreateFlashcard(formData);
                    setAddCardDialogOpen(false);
                }}
            />
            <Button
                className="border border-dashed border-stone-300 text-stone-400 hover:bg-stone-200/50"
                onClick={() => setAddCardDialogOpen(true)}
            >
                <PlusIcon className="mr-2 h-5 w-5" />
                Add
            </Button>
            {cards.map((card) => (
                <Flashcard
                    id={card.card_id!}
                    deckId={card.deck_id!}
                    key={card.card_id}
                    front={card.card_front}
                    back={card.card_back}
                    flipBackOnMouseLeave
                />
            ))}
        </div>
    );
};

export default FlashcardEditorGrid;
