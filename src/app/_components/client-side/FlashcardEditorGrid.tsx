'use client';

import { Flashcard as FlashcardType } from '@/app/_lib/types';
import { swapItemsById } from '@/app/_lib/utils';
import {
    handleDeleteFlashcard,
    handleEditFlashcard,
    handleNewFlashcard,
    handleReorderFlashcards,
} from '@/app/(logged-in)/decks/[id]/actions';
import { DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { startTransition, useOptimistic, useState } from 'react';
import Button from '../Button';
import AddFlashcardDialog from './AddFlashcardDialog';
import EditFlashcardDialog from './EditFlashcardDialog';
import Flashcard from './Flashcard';
import FlashcardEditorDraggableWrapper from './FlashcardEditorDraggableWrapper';
import FlashcardEditorDroppableArea from './FlashcardEditorDroppableArea';
import styles from './FlashcardEditorGrid.module.scss';
import Input from './Input';

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

    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const filteredCards = cards.filter((card) => {
            return (
                card.front.toLowerCase().includes(value.toLowerCase()) ||
                card.back.toLowerCase().includes(value.toLowerCase())
            );
        });

        setLocalCards(filteredCards);
    };

    return (
        <>
            <div className="flex flex-row">
                <Input
                    textSize="xs"
                    type="text"
                    placeholder="Search"
                    classes={{ root: 'mb-4' }}
                    prefix={<MagnifyingGlassIcon className="h-4 w-4" />}
                    onChange={onSearch}
                />
            </div>
            <DndContext
                onDragEnd={async ({ active, over }) => {
                    if (!over) {
                        return;
                    }

                    const reorderedCards = swapItemsById(
                        localCards,
                        active.id,
                        over.id,
                    );
                    startTransition(() => {
                        setOptimisticCards(reorderedCards);
                    });

                    const activeCard = optimisticCards.find(
                        (card) => card.id === active.id,
                    );
                    const overCard = optimisticCards.find(
                        (card) => card.id === over.id,
                    );

                    if (!activeCard || !overCard) {
                        return;
                    }

                    const updatedDeck = await handleReorderFlashcards(
                        reorderedCards,
                        deckId,
                    );
                    setLocalCards(updatedDeck);
                }}
            >
                <SortableContext
                    items={optimisticCards}
                    strategy={rectSortingStrategy}
                >
                    <FlashcardEditorDroppableArea>
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
                                                          back: formData.get(
                                                              'back',
                                                          ) as string,
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
                                                front: formData.get(
                                                    'front',
                                                ) as string,
                                                back: formData.get(
                                                    'back',
                                                ) as string,
                                                position:
                                                    optimisticCards.length,
                                                created_at:
                                                    new Date().toISOString(),
                                                updated_at:
                                                    new Date().toISOString(),
                                            },
                                        ]);
                                    });
                                    const newCard = await handleNewFlashcard(
                                        formData,
                                        deckId,
                                    );

                                    if (newCard) {
                                        setLocalCards([...localCards, newCard]);
                                    } else {
                                        setLocalCards(localCards);
                                    }
                                }}
                            />
                            <Button
                                className="min-h-48 border border-dashed border-stone-300 text-stone-400 hover:bg-stone-200/50"
                                onClick={() => setAddCardDialogOpen(true)}
                            >
                                <PlusIcon className="mr-2 h-5 w-5" />
                                Add
                            </Button>
                            {optimisticCards.map((card) => (
                                <FlashcardEditorDraggableWrapper
                                    key={card.id}
                                    id={card.id}
                                >
                                    {({ isDragging }) => (
                                        <Flashcard
                                            front={card.front}
                                            back={card.back}
                                            onDelete={async () => {
                                                startTransition(() => {
                                                    setOptimisticCards(
                                                        optimisticCards.filter(
                                                            (c) =>
                                                                c.id !==
                                                                card.id,
                                                        ),
                                                    );
                                                });

                                                try {
                                                    await handleDeleteFlashcard(
                                                        card.id,
                                                    );
                                                    setLocalCards(
                                                        localCards.filter(
                                                            (c) =>
                                                                c.id !==
                                                                card.id,
                                                        ),
                                                    );
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            }}
                                            onEdit={() => setEditedCard(card)}
                                            flipBackOnMouseLeave
                                            isDragging={isDragging}
                                        />
                                    )}
                                </FlashcardEditorDraggableWrapper>
                            ))}
                        </div>
                    </FlashcardEditorDroppableArea>
                </SortableContext>
            </DndContext>
        </>
    );
};

export default FlashcardEditorGrid;
