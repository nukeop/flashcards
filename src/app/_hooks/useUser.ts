import { createBrowserClient } from '@supabase/ssr';
import { useContext, useEffect, useState } from 'react';
import { Database } from '../_lib/database.types';
import { UserContext } from '../_providers/UserContext';

export const useUser = () => {
    const context = useContext(UserContext);
    const [reload, setReload] = useState(false);

    if (context === undefined) {
        throw new Error('useUser must be used within a UserContext.Provider');
    }

    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    useEffect(() => {
        async function getUser() {
            context.setIsLoading(true);
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            if (session) {
                context.setSession(session);
                context.setIsLoading(false);
                context.setIsReady(true);
                context.setHasError(false);
                context.setError(null);
                return;
            }

            if (error) {
                context.setIsLoading(false);
                context.setIsReady(true);
                context.setHasError(true);
                context.setError(error.message);
                return;
            }
        }

        getUser();
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            context.setSession(session);
        });

        return () => subscription.unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);

    return { ...context, reload, setReload };
};
