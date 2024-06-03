import { Deck } from '@/app/_lib/types';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 } from 'uuid';

export const dateRegex =
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{1,6}\+\d{2}:\d{2}/;
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

    // Local development keys - safe to commit
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

export class DeckBuilder {
    private id: string;
    private name: string;
    private description: string;
    private is_public: boolean;
    private user_id: string;
    private created_at: string;
    private _modified: string;
    private _deleted: boolean;

    constructor() {
        this.id = v4();
        this.name = 'Deck';
        this.description = 'Description for deck';
        this.is_public = true;
        this.user_id = '';
        this.created_at = '';
        this._modified = '';
        this._deleted = false;
    }

    public withName(name: string) {
        this.name = name;
        return this;
    }

    public withDescription(description: string) {
        this.description = description;
        return this;
    }

    public async withUserId(client: SupabaseClient) {
        this.user_id = (await client.auth.getUser()).data?.user?.id ?? '';
        return this;
    }

    build(): Deck {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            is_public: this.is_public,
            user_id: this.user_id,
            created_at: this.created_at,
            _modified: this._modified,
            _deleted: this._deleted,
        };
    }
}
