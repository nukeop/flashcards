'use client';

import clsx from 'clsx';
import { Database } from '../_lib/database.types';
import Flashcard from './Flashcard';

type FlashcardEditorProps = {
    className?: string;
    currentCard?: Database['public']['Views']['deck_cards_view']['Row'];
    onFrontChange?: (front: string) => void;
    onBackChange?: (back: string) => void;
};

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({
    className,
    currentCard,
    onFrontChange,
    onBackChange,
}) => {
    return (
        <div className={clsx('grid grid-cols-3', className)}>
            <div className="col-span-2 flex flex-col gap-2">
                <div className="flex flex-grow flex-col">
                    <label className="rounded-t border-l border-r border-t border-muted/25 bg-base px-2 py-1 text-xs text-accent">
                        Front
                    </label>
                    <textarea
                        className="w-full flex-grow rounded-b border border-muted/25 bg-surface px-4 py-2 outline-none"
                        value={currentCard?.card_front}
                        onChange={(e) => {
                            onFrontChange?.(e.target.value);
                        }}
                    />
                </div>
                <div className="flex flex-grow flex-col">
                    <label className="rounded-t border-l border-r border-t border-muted/25 bg-base px-2 py-1 text-xs text-accent">
                        Back
                    </label>
                    <textarea
                        className="w-full flex-grow rounded border border-muted/25 bg-surface px-4 py-2 outline-none"
                        value={currentCard?.card_back}
                        onChange={(e) => {
                            onBackChange?.(e.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="flex w-full flex-row items-center justify-center px-4 py-2">
                <Flashcard
                    front={currentCard?.card_front}
                    back={currentCard?.card_back}
                />
            </div>
        </div>
    );
};

export default FlashcardEditor;
