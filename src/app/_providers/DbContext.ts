import { createContext, useEffect, useState } from 'react';
import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

interface DbContextType {
    db: RxDatabase | null;
    isReady: boolean;
}

export const DbContext = createContext<DbContextType>({} as DbContextType);

export const useDbContextState = () => {
    const [db, setDb] = useState<RxDatabase | null>(null);
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            addRxPlugin(RxDBDevModePlugin);
        }

        if (!db) {
            createRxDatabase({
                name: 'flashcards',
                storage: getRxStorageDexie(),
                ignoreDuplicate: true,
            }).then(async (newDb) => {
                setDb(newDb);
            });
        }
    }, []);

    return {
        db,
        isReady,
        setIsReady,
    };
};
