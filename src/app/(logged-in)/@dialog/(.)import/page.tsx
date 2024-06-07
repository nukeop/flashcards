'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { ChangeEvent, Fragment, useRef, useState } from 'react';
import { useRxCollection } from 'rxdb-hooks';
import * as Yup from 'yup';
import ActionDialogContent from '@/app/_components/ActionDialogContent';
import Button from '@/app/_components/Button';
import Dialog from '@/app/_components/client-side/Dialog';
import Message from '@/app/_components/Message';
import { useUser } from '@/app/_hooks/useUser';
import {
    importDeck,
    ImportedDeck,
    ImportedDeckSchema,
} from '@/app/_lib/import';
import { Deck as DeckType, Flashcard as FlashcardType } from '@/app/_lib/types';

export default function Page() {
    const router = useRouter();
    const onClose = () => {
        router.back();
    };

    const [issues, setIssues] = useState<
        {
            path: string;
            message: string;
        }[]
    >([]);

    const [importResult, setImportResult] = useState<ImportedDeck | null>(null);

    const { session } = useUser();
    const decksCollection = useRxCollection<DeckType>('decks');
    const flashcardsCollection = useRxCollection<FlashcardType>('flashcards');

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setIssues([]);
        setImportResult(null);
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = JSON.parse(e!.target!.result?.toString() ?? '');

                try {
                    const result = await ImportedDeckSchema.validate(content, {
                        abortEarly: false,
                    });

                    if (result) {
                        setImportResult(result);
                    }
                } catch (e) {
                    const validationError = e as Yup.ValidationError;

                    setIssues(
                        validationError.inner.map((error) => ({
                            path: error.path ?? '',
                            message: error.message,
                        })),
                    );
                }
            };
            reader.readAsText(file);
        }
    };
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Dialog isOpen onClose={onClose}>
            <ActionDialogContent title="Import a deck" onClose={onClose}>
                <Button
                    intent="basic"
                    onClick={() => {
                        if (inputRef.current) {
                            inputRef.current.click();
                        }
                    }}
                >
                    <ArrowDownTrayIcon className="h-6 w-6" />
                    <input
                        ref={inputRef}
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    Import from JSON
                </Button>

                {issues.length > 0 && (
                    <div className="mt-4">
                        <Message type="error" title="Validation issues">
                            There are issues with the imported deck.
                        </Message>
                        <div className="mt-2 grid grid-cols-2 gap-2 border border-stone-200 px-2 py-4">
                            {issues.map((issue, index) => (
                                <Fragment key={index}>
                                    <div className="font-bold">
                                        {issue.path}
                                    </div>
                                    <div>{issue.message}</div>
                                </Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {importResult && (
                    <div className="mt-4">
                        <Message type="success" title="Import successful">
                            The deck was imported successfully.
                        </Message>
                        <h2 className="my-2 text-lg font-bold">
                            Imported deck
                        </h2>
                        <div className="grid grid-cols-2">
                            <strong>Name:</strong> {importResult.name}
                            {importResult.description && (
                                <>
                                    <strong>Description:</strong>{' '}
                                    {importResult.description}
                                </>
                            )}
                            <strong>Cards:</strong> {importResult.cards.length}
                        </div>
                        <span className="flex justify-end">
                            <Button
                                intent="primary"
                                className="mt-4"
                                onClick={async () => {
                                    await importDeck({
                                        deck: importResult,
                                        decksCollection: decksCollection!,
                                        flashcardsCollection:
                                            flashcardsCollection!,
                                        session: session!,
                                    });
                                    onClose();
                                }}
                            >
                                Add to collection
                            </Button>
                        </span>
                    </div>
                )}
            </ActionDialogContent>
        </Dialog>
    );
}
