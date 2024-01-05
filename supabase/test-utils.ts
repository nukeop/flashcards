import { SupabaseClient, createClient } from '@supabase/supabase-js';

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

export class TestFixture {
    private static supabase: SupabaseClient;
    private constructor() {}

    static initialize() {
        const supabaseUrl = 'http://127.0.0.1:54321';
        const SUPABASE_KEY =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
        TestFixture.supabase = createClient(supabaseUrl, SUPABASE_KEY);
    }

    static getClient() {
        return this.supabase;
    }

    static async logIn(email: string, password: string) {
        const { data } = await TestFixture.supabase.auth.signInWithPassword({
            email,
            password,
        });
        return data?.user?.id;
    }

    static async logOut() {
        await TestFixture.supabase.auth.signOut();
    }
}
