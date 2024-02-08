'use client';

import { Flashcard as FlashcardType } from '@/app/_lib/types';
import {
    handleDeleteFlashcard,
    handleEditFlashcard,
    handleNewFlashcard,
} from '@/app/(logged-in)/decks/[id]/actions';
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { startTransition, useOptimistic, useState } from 'react';
import Button from '../Button';
import AddFlashcardDialog from './AddFlashcardDialog';
import EditFlashcardDialog from './EditFlashcardDialog';
import Flashcard from './Flashcard';
import styles from './FlashcardEditorGrid.module.scss';

type FlashcardEditorGridProps = {
    cards: FlashcardType[];
    deckId: string;
};

const FlashcardEditorGrid: React.FC<FlashcardEditorGridProps> = ({
    cards,
    deckId,
}) => {
    const [localCards, setLocalCards] = useState(cards);
    const [editedCard, setEditedCard] = useState<FlashcardType | null>(null);
    const [isAddCardDialogOpen, setAddCardDialogOpen] = useState(false);

    const [optimisticCards, setOptimisticCards] = useOptimistic<
        FlashcardType[],
        FlashcardType[]
    >(
        localCards,
        (state: FlashcardType[], newCards: FlashcardType[]) => newCards,
    );

    return (
        <div
            className={clsx(
                'grid w-full gap-4',
                styles['flashcard-grid-container'],
            )}
        >
            <EditFlashcardDialog
                flashcard={editedCard}
                onClose={() => setEditedCard(null)}
                onCancel={() => setEditedCard(null)}
                onSave={async (formData: FormData) => {
                    startTransition(() => {
                        setEditedCard(null);
                        setOptimisticCards(
                            optimisticCards.map((card) =>
                                card.id === editedCard?.id
                                    ? {
                                          ...card,
                                          front: formData.get(
                                              'front',
                                          ) as string,
                                          back: formData.get('back') as string,
                                      }
                                    : card,
                            ),
                        );
                    });
                    const data = await handleEditFlashcard(
                        formData,
                        editedCard!.id,
                    );

                    if (data) {
                        setLocalCards(
                            localCards.map((card) =>
                                card.id === editedCard?.id
                                    ? {
                                          ...card,
                                          front: data.front,
                                          back: data.back,
                                      }
                                    : card,
                            ),
                        );
                    } else {
                        setLocalCards(localCards);
                    }
                }}
            />
            <AddFlashcardDialog
                isOpen={isAddCardDialogOpen}
                onCancel={() => setAddCardDialogOpen(false)}
                onClose={() => setAddCardDialogOpen(false)}
                onSave={async (formData: FormData) => {
                    startTransition(() => {
                        setAddCardDialogOpen(false);
                        setOptimisticCards([
                            ...optimisticCards,
                            {
                                id: 'temp-id',
                                deck_id: deckId,
                                front: formData.get('front') as string,
                                back: formData.get('back') as string,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                            },
                        ]);
                    });
                    const newCard = await handleNewFlashcard(formData, deckId);

                    if (newCard) {
                        setLocalCards([...localCards, newCard]);
                    } else {
                        setLocalCards(localCards);
                    }
                }}
            />
            <Button
                className="border border-dashed border-stone-300 text-stone-400 hover:bg-stone-200/50"
                onClick={() => setAddCardDialogOpen(true)}
            >
                <PlusIcon className="mr-2 h-5 w-5" />
                Add
            </Button>
            {optimisticCards.map((card) => (
                <Flashcard
                    key={card.id}
                    front={card.front}
                    back={card.back}
                    onDelete={async () => {
                        startTransition(() => {
                            setOptimisticCards(
                                optimisticCards.filter((c) => c.id !== card.id),
                            );
                        });

                        try {
                            await handleDeleteFlashcard(card.id);
                            setLocalCards(
                                localCards.filter((c) => c.id !== card.id),
                            );
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                    onEdit={() => setEditedCard(card)}
                    flipBackOnMouseLeave
                />
            ))}
        </div>
    );
};

export default FlashcardEditorGrid;
