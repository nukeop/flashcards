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
        context.setIsLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            context.setSession(session);

            if (session?.user?.id) {
                context.setIsLoading(false);
                context.setIsReady(true);
                return;
            }
        });
        //     return supabase
        //         .from('user_profiles')
        //         .select('*')
        //         .eq('user_id', session.user.id)
        //         .single();
        // })
        // .then(async (profile) => {
        //     if (profile?.error) {
        //         throw new Error(profile.error.message);
        //     }

        //     if (profile?.data) {
        //         context.setUserProfile(profile.data);
        //         context.setIsLoading(false);
        //         context.setIsReady(true);
        //     }
        // });

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
