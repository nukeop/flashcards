'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { Database } from '../_lib/database.types';
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
    const [isSaving, setSaving] = useState(false);

    return (
        <div className={clsx('flex flex-grow flex-row gap-2', className)}>
            <div className="flex flex-grow flex-col rounded ring-1 ring-indigo-200 focus-within:ring-2 focus-within:ring-indigo-400">
                <label className="rounded bg-slate-50 px-2 py-1 text-sm font-bold text-indigo-800">
                    Front
                </label>
                <textarea
                    className="w-full flex-grow rounded-b border-t border-indigo-200 bg-white px-4 py-2 outline-none "
                    value={front}
                    onChange={(e) => {
                        setFront(e.target.value);
                    }}
                    onFocus={() => {
                        setActiveCardFlipped(false);
                    }}
                />
            </div>
            <div className="ring-inner flex flex-grow flex-col rounded ring-1 ring-indigo-200 focus-within:ring-2 focus-within:ring-indigo-400">
                <label className="rounded bg-slate-50 px-2 py-1 text-sm font-bold text-indigo-800">
                    Back
                </label>
                <textarea
                    className="w-full flex-grow rounded-b border-t border-indigo-200 bg-white px-4 py-2 outline-none"
                    value={back}
                    onChange={(e) => {
                        setBack(e.target.value);
                    }}
                    onFocus={() => {
                        setActiveCardFlipped(true);
                    }}
                />
            </div>
            <div className="flex min-h-64 flex-shrink-0 flex-col items-center justify-center rounded px-4">
                <label className="w-full bg-transparent px-2 text-sm font-bold">
                    Preview
                </label>
                <div className="flex-grow px-2 py-2 pb-4">
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
