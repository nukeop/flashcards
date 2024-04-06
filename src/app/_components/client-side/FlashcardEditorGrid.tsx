'use client';

import { Flashcard as FlashcardType } from '@/app/_lib/types';
import { findFirstMissingIndex, swapItemsById } from '@/app/_lib/utils';
import { DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { RxDocument } from 'rxdb';
import { useRxCollection } from 'rxdb-hooks';
import { v4 } from 'uuid';
import Button from '../Button';
import AddFlashcardDialog from './AddFlashcardDialog';
import EditFlashcardDialog from './EditFlashcardDialog';
import Flashcard from './Flashcard';
import FlashcardEditorDraggableWrapper from './FlashcardEditorDraggableWrapper';
import FlashcardEditorDroppableArea from './FlashcardEditorDroppableArea';
import styles from './FlashcardEditorGrid.module.scss';
import Input from './Input';

type FlashcardEditorGridProps = {
    cards: RxDocument<FlashcardType>[];
    deckId: string;
};

const FlashcardEditorGrid: React.FC<FlashcardEditorGridProps> = ({
    cards,
    deckId,
}) => {
    const [localCards, setLocalCards] = useState(cards);
    const [editedCard, setEditedCard] = useState<FlashcardType | null>(null);
    const [isAddCardDialogOpen, setAddCardDialogOpen] = useState(false);
    const flashcardsCollection = useRxCollection<FlashcardType>('flashcards');

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

    useEffect(() => {
        setLocalCards(cards);
    }, [cards]);

    return (
        <>
            <div className="flex flex-row">
                <Input
                    textSize="xs"
                    type="text"
                    placeholder="Search"
                    classes={{ root: 'mb-4', inputFrame: 'rounded' }}
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

                    await Promise.all(
                        reorderedCards.map(async (card, index) => {
                            return card.patch({ position: index });
                        }),
                    );

                    setLocalCards(reorderedCards);
                }}
            >
                <SortableContext
                    items={localCards}
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
                                    setEditedCard(null);

                                    const newEditedCard = localCards.find(
                                        (card) => card.id === editedCard?.id,
                                    ) as RxDocument<FlashcardType>;
                                    await newEditedCard?.patch({
                                        front: formData.get('front') as string,
                                        back: formData.get('back') as string,
                                    });
                                }}
                            />
                            <AddFlashcardDialog
                                isOpen={isAddCardDialogOpen}
                                onCancel={() => setAddCardDialogOpen(false)}
                                onClose={() => setAddCardDialogOpen(false)}
                                onSave={async (formData: FormData) => {
                                    setAddCardDialogOpen(false);
                                    await flashcardsCollection?.insert({
                                        id: v4(),
                                        deck_id: deckId,
                                        front: formData.get('front') as string,
                                        back: formData.get('back') as string,
                                        created_at: new Date().toISOString(),
                                        position: findFirstMissingIndex(
                                            localCards.map(
                                                (card) => card.position,
                                            ),
                                        ),
                                    });
                                }}
                            />
                            <Button
                                className="min-h-48 border border-dashed border-stone-300 text-stone-400 hover:bg-stone-200/50"
                                onClick={() => setAddCardDialogOpen(true)}
                            >
                                <PlusIcon className="mr-2 h-5 w-5" />
                                Add
                            </Button>
                            {localCards.map((card) => (
                                <FlashcardEditorDraggableWrapper
                                    key={card.id}
                                    id={card.id}
                                >
                                    {({ isDragging }) => (
                                        <Flashcard
                                            front={card.front}
                                            back={card.back}
                                            onDelete={async () => {
                                                card.remove();
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
