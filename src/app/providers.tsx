'use client';

import { useEffect } from 'react';
import { Provider as RxdbProvider } from 'rxdb-hooks';
import { useRxDbState } from './_hooks/useRxDbState';
import { UserContext, useUserContextState } from './_providers/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
    const userContextState = useUserContextState();
    const { db } = useRxDbState();

    useEffect(() => {
        if (db) {
            new Promise(() => {
                console.log('🟢 [RxDB] Database ready'); // eslint-disable-line no-console
            });
        }
    }, [db]);

    return (
        <RxdbProvider db={db!}>
            <UserContext.Provider value={userContextState}>
                {children}
            </UserContext.Provider>
        </RxdbProvider>
    );
}
