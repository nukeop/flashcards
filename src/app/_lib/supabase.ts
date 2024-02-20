import { PostgrestBuilder } from '@supabase/postgrest-js';
import { CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from './database.types';

export const createSSRClient = () => {
    const cookieStore = cookies();
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.delete({ name, ...options });
                },
            },
        },
    );
};

export const doOrThrow = async <D>(
    promise: PostgrestBuilder<D>,
    errorMessage: string,
) => {
    const { data, error } = await promise;
    if (error) {
        console.error(error);
        throw new Error(errorMessage);
    }

    return data;
};
