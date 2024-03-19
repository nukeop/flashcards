'use client';

import { useEffect } from 'react';
import { DbContext, useDbContextState } from './_providers/DbContext';
import { UserContext, useUserContextState } from './_providers/UserContext';

const deckSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        user_id: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        is_public: { type: 'boolean' },
    },
    required: [
        'id',
        'user_id',
        'name',
        'created_at',
        'updated_at',
        'is_public',
    ],
};

const flashcardSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        deck_id: { type: 'string' },
        front: { type: 'string' },
        back: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        position: { type: 'number' },
    },
    required: [
        'id',
        'deck_id',
        'front',
        'back',
        'created_at',
        'updated_at',
        'position',
    ],
};

export function Providers({ children }: { children: React.ReactNode }) {
    const userContextState = useUserContextState();
    const dbContextState = useDbContextState();

    useEffect(() => {
        if (dbContextState.db) {
            console.log('db exists');
            dbContextState.db?.addCollections({
                decks: { schema: deckSchema },
                flashcards: { schema: flashcardSchema },
            });
        }
    }, [dbContextState.db]);

    return (
        <DbContext.Provider value={dbContextState}>
            <UserContext.Provider value={userContextState}>
                {children}
            </UserContext.Provider>
        </DbContext.Provider>
    );
}
