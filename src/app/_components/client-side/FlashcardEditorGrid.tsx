'use client';

import { DeckCardView } from '@/app/_lib/types';
import {
    DocumentTextIcon,
    ForwardIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useState } from 'react';
import Button from '../Button';
import Flashcard from '../Flashcard';
import Dialog from './Dialog';
import styles from './FlashcardEditorGrid.module.scss';

type FlashcardEditorGridProps = {
    cards: DeckCardView[];
};

const FlashcardEditorGrid: React.FC<FlashcardEditorGridProps> = ({ cards }) => {
    const [isAddCardDialogOpen, setAddCardDialogOpen] = useState(false);

    return (
        <div
            className={clsx(
                'grid w-full gap-4',
                styles['flashcard-grid-container'],
            )}
        >
            <Dialog
                isOpen={isAddCardDialogOpen}
                onOpen={() => setAddCardDialogOpen(true)}
                onClose={() => setAddCardDialogOpen(false)}
            >
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-2 flex w-full flex-row justify-between bg-stone-100 px-4 py-2 text-sm text-stone-500 shadow-sm">
                        <Button>Cancel</Button>
                        <Button>Save</Button>
                    </div>
                    <div className="grid flex-grow grid-cols-3 gap-2 bg-stone-50 px-2 py-4">
                        <label
                            className="px-2 py-1 text-sm text-stone-400"
                            htmlFor="card-front"
                        >
                            Front
                        </label>
                        <textarea
                            id="card-front"
                            className="col-span-2 min-h-32 w-full min-w-64 flex-grow rounded border border-stone-300 bg-stone-200 px-4 py-2 outline-none focus:border-stone-400"
                        />
                        <label
                            className="px-2 py-1 text-sm text-stone-400"
                            htmlFor="card-back"
                        >
                            Back
                        </label>
                        <textarea
                            id="card-back"
                            className="col-span-2 min-h-32 w-full min-w-64 flex-grow rounded border border-stone-300 bg-stone-200 px-4 py-2 outline-none focus:border-stone-400"
                        />
                    </div>
                </div>
            </Dialog>
            <Button
                className="border border-dashed border-stone-300 text-stone-400 hover:bg-stone-200/50"
                onClick={() => setAddCardDialogOpen(true)}
            >
                <PlusIcon className="mr-2 h-5 w-5" />
                Add
            </Button>
            {cards.map((card) => (
                <Flashcard
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
