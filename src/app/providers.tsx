'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useEffect } from 'react';
import { Provider as RxdbProvider } from 'rxdb-hooks';
import { useRxDbState } from './_hooks/useRxDbState';
import { Database } from './_lib/database.types';
import { UserContext, useUserContextState } from './_providers/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
    const userContextState = useUserContextState();
    const { db } = useRxDbState();

    useEffect(() => {
        if (db) {
            new Promise(async () => {
                console.log('🟢 [RxDB] Database ready'); // eslint-disable-line no-console
                const supabase = createBrowserClient<Database>(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                );
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
