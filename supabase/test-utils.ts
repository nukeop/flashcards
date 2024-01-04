import { SupabaseClient } from '@supabase/supabase-js';

export const dateRegex =
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}\+\d{2}:\d{2}/;
export const uuidRegex = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;

export const createLogIn =
    (supabase: SupabaseClient) => async (email: string, password: string) => {
        const { data } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return data?.user?.id;
    };
