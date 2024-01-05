import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { TestFixture, dateRegex, uuidRegex } from './test-utils';

describe('User profiles', () => {
    beforeAll(() => {
        TestFixture.initialize();
    });

    beforeEach(async () => TestFixture.logOut());

    it('should allow anon users to view user profiles', async () => {
        const { data: profile, error } = await TestFixture.getClient()
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
        await TestFixture.logIn('user1@example.com', 'password123');

        const { data: profileData } = await TestFixture.getClient()
            .from('user_profiles')
            .select('id')
            .eq('username', 'user1');

        const { data: updatedProfileData, error: updateError } =
            await TestFixture.getClient()
                .from('user_profiles')
                .update({ username: 'user2' })
                .eq('id', (profileData![0] as { id: string }).id)
                .select('username');

        expect(updateError).toBeNull();
        expect(updatedProfileData).toEqual([{ username: 'user2' }]);

        await TestFixture.getClient()
            .from('user_profiles')
            .update({ username: 'user1' })
            .eq('id', (profileData![0] as { id: string }).id);
    });

    it('should not allow users to update other users user_profiles', async () => {
        await TestFixture.logIn('user2@example.com', 'password123');

        const { data: profileData } = await TestFixture.getClient()
            .from('user_profiles')
            .select('id')
            .eq('username', 'user1');

        const { data: updatedProfileData, error: updateError } =
            await TestFixture.getClient()
                .from('user_profiles')
                .update({ username: 'user2 changed this' })
                .eq('id', (profileData![0] as { id: string }).id)
                .select('username');

        expect(updateError).toBeNull();
        expect(updatedProfileData).toEqual([]);

        const { data: originalProfileData } = await TestFixture.getClient()
            .from('user_profiles')
            .select('username')
            .eq('id', (profileData![0] as { id: string }).id);

        expect(originalProfileData).toEqual([{ username: 'user1' }]);
    });
});
