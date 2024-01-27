'use client';

import Button from '@/app/_components/Button';
import FlashcardEditor from '@/app/_components/FlashcardEditor';
import Panel from '@/app/_components/Panel';
import { Database } from '@/app/_lib/database.types';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './FlashcardListItem.module.scss';

type DeckCardView = Database['public']['Views']['deck_cards_view']['Row'];
type ExpandedCardProps = {
    card: DeckCardView;
    currentCardId: string;
    onDelete: () => void;
    onSave: (front: string, back: string) => void;
};

const FlashcardListItem: React.FC<ExpandedCardProps> = ({
    card,
    currentCardId,
    onDelete,
    onSave,
}) => {
    const isExpanded = card.card_id === currentCardId;
    const [isSaving, setIsSaving] = useState(false);
    const [isProgressVisible, setIsProgressVisible] = useState(false);

    const handleSave = async (front: string, back: string) => {
        setIsSaving(true);
        await onSave(front, back);
        setIsSaving(false);
    };

    useEffect(() => {
        if (!isSaving) {
            setTimeout(() => {
                setIsProgressVisible(false);
            }, 1000);
        } else {
            setIsProgressVisible(true);
        }
    }, [isSaving]);

    return (
        <Panel
            as="li"
            key={card.card_id}
            className={clsx(
                'group relative my-2 flex flex-row items-center overflow-hidden rounded border border-slate-200 bg-white px-3 py-3 text-text shadow ',
                {
                    'border-indigo-400 bg-indigo-50 text-stone-600': isExpanded,
                },
            )}
            hoverEffect={!isExpanded}
        >
            <div
                className={clsx(
                    'duration-2000 transition-width absolute left-0 top-0 h-1 w-full ease-in-out',
                    styles['progress-bar'],
                    {
                        'bg-indigo-500': isProgressVisible,
                        'w-full': isProgressVisible,
                        'w-0': !isProgressVisible,
                        'bg-transparent': !isProgressVisible,
                    },
                )}
            />

            <div className="flex flex-grow flex-col">
                <div className="flex flex-row items-center justify-start">
                    <Link
                        key={card.card_id}
                        href={`/decks/${card.deck_id}/${card.card_id}`}
                    >
                        <Button className="mr-2 flex h-10 w-10 items-center justify-center p-0">
                            {isExpanded ? (
                                <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                            )}
                        </Button>
                    </Link>
                    <span className="cursor-default">{card.card_front}</span>
                    <span className="flex-grow" />
                    <form action={onDelete}>
                        <Button
                            className="ml-2 hidden h-10 w-10 text-muted shadow group-hover:flex"
                            type="submit"
                        >
                            <TrashIcon className="h-6 w-6" />
                        </Button>
                    </form>
                </div>
                {isExpanded && (
                    <FlashcardEditor
                        className="col-span-2 mt-2"
                        currentCard={card}
                        onSave={async (front: string, back: string) => {
                            handleSave(front, back);
                        }}
                    />
                )}
            </div>
        </Panel>
    );
};

export default FlashcardListItem;
