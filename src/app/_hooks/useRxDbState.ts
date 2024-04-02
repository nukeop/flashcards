import { createBrowserClient } from '@supabase/ssr';
import { AuthSession } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { SupabaseReplication } from 'rxdb-supabase';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { Database } from '../_lib/database.types';
import { useEventListener } from './useEventListener';

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
        is_public: { type: 'boolean' },
    },
    required: ['id', 'user_id', 'name', 'created_at', 'is_public'],
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
        position: { type: 'number' },
    },
    required: ['id', 'deck_id', 'front', 'back', 'created_at', 'position'],
};

const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const initialize = async () => {
    if (process.env.NODE_ENV === 'development') {
        addRxPlugin(RxDBDevModePlugin);
    }
    addRxPlugin(RxDBQueryBuilderPlugin);

    const db = await createRxDatabase({
        name: 'flashcards',
        storage: getRxStorageDexie(),
        ignoreDuplicate: true,
    });

    await db.addCollections({
        decks: { schema: deckSchema },
        flashcards: { schema: flashcardSchema },
    });

    return db;
};

const enableReplication = async (db: RxDatabase) => {
    const user = await supabase.auth.getUser();
    if (user.error) {
        throw user.error;
    }

    if (!user || !user.data) {
        throw new Error('User not found');
    }

    const userId = user.data.user.id.replaceAll('-', '_');
    const decksReplication = new SupabaseReplication({
        supabaseClient: supabase,
        collection: db.decks,
        table: `decks`,
        replicationIdentifier: `decks_${process.env.NEXT_PUBLIC_SUPABASE_URL}_${userId}`,
        pull: {},
        push: {},
    });

    decksReplication.error$.subscribe((error) => {
        const message = error.parameters.errors?.[0].message;
        console.error('🔴 [RxDb] Replication error: ');
        console.error(message);
    });

    const flashcardsReplication = new SupabaseReplication({
        supabaseClient: supabase,
        collection: db.flashcards,
        table: `flashcards`,
        replicationIdentifier: `flashcards_${process.env.NEXT_PUBLIC_SUPABASE_URL}_${userId}`,
        pull: {},
        push: {},
    });

    flashcardsReplication.error$.subscribe((error) => {
        const message = error.parameters.errors?.[0].message;
        console.error('🔴 [RxDb] Replication error: ');
        console.error(message);
    });

    return { decksReplication, flashcardsReplication };
};

export const useRxDbState = () => {
    const [db, setDb] = useState<RxDatabase | null>(null);
    const [auth, setAuth] = useState<AuthSession | null>(null);
    const [replication, setReplication] = useState<SupabaseReplication | null>(
        null,
    );

    useEffect(() => {
        initialize().then((db) => {
            setDb(db);
        });

        supabase.auth.getSession().then(({ data: { session }, error }) => {
            setAuth(session);
            if (error) {
                console.error('🔴 [Supabase] Auth error:');
                console.error(error.message);
                throw new Error(error.message);
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuth(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (auth?.user?.id && db) {
            enableReplication(db).then((replicationSetup) => {
                console.log('🟢 [RxDB] Starting replication'); // eslint-disable-line no-console
                replicationSetup.decksReplication.start();
                replicationSetup.flashcardsReplication.start();
                setReplication(replicationSetup);
                console.log('🟢 [RxDB] Replication started'); // eslint-disable-line no-console
            });
        } else {
            replication?.cancel();
            console.warn('🔴 [RxDB] Not logged in - replication stopped');
        }
    }, [auth, db]); // eslint-disable-line react-hooks/exhaustive-deps

    useEventListener('online', () => {
        if (!replication) return;
        replication.reSync();
        console.log('🔄 [RxDB] Replication resync'); // eslint-disable-line no-console
    });

    return { db };
};
