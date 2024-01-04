import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createLogIn, dateRegex, uuidRegex } from './test-utils';

describe('User profiles', () => {
    let supabase: SupabaseClient;
    beforeAll(() => {
        const supabaseUrl = 'http://127.0.0.1:54321';
        const SUPABASE_KEY =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
        supabase = createClient(supabaseUrl, SUPABASE_KEY);
    });

    beforeEach(async () => {
        supabase.auth.signOut();
    });

    it('should allow anon users to view user profiles', async () => {
        const { data: profile, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('username', 'user1')
            .single();

        expect(error).toBeNull();
        expect(profile).toEqual({
            id: expect.stringMatching(uuidRegex),
            user_id: expect.stringMatching(uuidRegex),
            username: 'user1',
            created_at: expect.stringMatching(dateRegex),
            updated_at: expect.stringMatching(dateRegex),
        });
    });

    it('should allow users to update their own user_profiles', async () => {
        await logIn()('user1@example.com', 'password123');

        const { data: profileData } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('username', 'user1');

        const { data: updatedProfileData, error: updateError } = await supabase
            .from('user_profiles')
            .update({ username: 'user2' })
            .eq('id', (profileData![0] as { id: string }).id)
            .select('username');

        expect(updateError).toBeNull();
        expect(updatedProfileData).toEqual([{ username: 'user2' }]);
    });

    it('should not allow users to update other users user_profiles', async () => {
        await logIn()('user2@example.com', 'password123');

        const { data: profileData } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('username', 'user1');

        const { data: updatedProfileData, error: updateError } = await supabase
            .from('user_profiles')
            .update({ username: 'user2' })
            .eq('id', (profileData![0] as { id: string }).id)
            .select('username');

        expect(updateError).toBeNull();
        expect(updatedProfileData).toEqual([]);
    });

    const logIn = () => createLogIn(supabase);
});
