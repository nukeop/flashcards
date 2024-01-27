'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { Database } from '../_lib/database.types';
import { debounce } from '../_lib/utils';
import Flashcard from './Flashcard';

type FlashcardEditorProps = {
    className?: string;
    currentCard?: Database['public']['Views']['deck_cards_view']['Row'];
    onSave: (front: string, back: string) => Promise<void>;
};

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({
    className,
    currentCard,
    onSave,
}) => {
    const [front, setFront] = useState(currentCard?.card_front ?? '');
    const [back, setBack] = useState(currentCard?.card_back ?? '');
    const [isActiveCardFlipped, setActiveCardFlipped] = useState<
        boolean | undefined
    >(undefined);

    const handleBlur = debounce(() => {
        if (
            front === currentCard?.card_front &&
            back === currentCard?.card_back
        )
            return;
        onSave(front, back);
    }, 3000);

    return (
        <div className={clsx('flex flex-grow flex-row gap-2', className)}>
            <div className="flex flex-grow flex-col rounded">
                <label className="px-2 py-1 text-sm font-bold">Front</label>
                <textarea
                    className="ring-inner w-full flex-grow rounded bg-slate-100 px-4 py-2 outline-none ring-1 ring-slate-300 focus-within:ring-2 focus:ring-indigo-400"
                    value={front}
                    onChange={(e) => {
                        setFront(e.target.value);
                    }}
                    onFocus={() => {
                        setActiveCardFlipped(false);
                    }}
                    onBlur={handleBlur}
                />
            </div>
            <div className=" flex flex-grow flex-col rounded">
                <label className="px-2 py-1 text-sm font-bold">Back</label>
                <textarea
                    className="w-full flex-grow rounded bg-slate-100 px-4 py-2 outline-none ring-1 ring-slate-300 focus-within:ring-2 focus:ring-indigo-400"
                    value={back}
                    onChange={(e) => {
                        setBack(e.target.value);
                    }}
                    onFocus={() => {
                        setActiveCardFlipped(true);
                    }}
                    onBlur={handleBlur}
                />
            </div>
            <div className="flex min-h-64 flex-shrink-0 flex-col items-center justify-center rounded">
                <label className="w-full bg-transparent px-2 text-sm font-bold">
                    Preview
                </label>
                <div className="flex-grow pt-1">
                    <Flashcard
                        front={front}
                        back={back}
                        isFlipped={isActiveCardFlipped}
                        onClick={() => {
                            setActiveCardFlipped(undefined);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FlashcardEditor;
