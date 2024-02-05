'use client';

import { DeckCardView } from '@/app/_lib/types';
import { handleNewCard } from '@/app/decks/[id]/actions';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import Button from '../Button';
import Flashcard from '../Flashcard';
import AddFlashcardDialog from './AddFlashcardDialog';
import styles from './FlashcardEditorGrid.module.scss';

type FlashcardEditorGridProps = {
    cards: DeckCardView[];
    deckId: string;
};

const FlashcardEditorGrid: React.FC<FlashcardEditorGridProps> = ({
    cards,
    deckId,
}) => {
    const [localCards, setLocalCards] = useState(cards);
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
                    handleNewCard(formData, deckId);
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
            {localCards.map((card) => (
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
