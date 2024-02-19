import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { dateRegex, TestFixture, uuidRegex } from './test-utils';

describe('User profiles', () => {
    beforeAll(() => {
        TestFixture.initialize();
    });

    beforeEach(async () => TestFixture.logOut());

    it('should allow anon users to view user profiles', async () => {
        const { data: profile, error } = await TestFixture.getClient()
            .from('user_profiles')
            .select('*')
            .eq('display_name', 'user1@example.com')
            .single();

        expect(error).toBeNull();
        expect(profile).toEqual({
            id: expect.stringMatching(uuidRegex),
            user_id: expect.stringMatching(uuidRegex),
            display_name: 'user1@example.com',
            created_at: expect.stringMatching(dateRegex),
            updated_at: expect.stringMatching(dateRegex),
        });
    });

    it('should allow users to update their own user_profiles', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');

        const { data: profileData } = await TestFixture.getClient()
            .from('user_profiles')
            .select('id')
            .eq('display_name', 'user1@example.com');

        const { data: updatedProfileData, error: updateError } =
            await TestFixture.getClient()
                .from('user_profiles')
                .update({ display_name: 'user2' })
                .eq('id', (profileData![0] as { id: string }).id)
                .select('display_name');

        expect(updateError).toBeNull();
        expect(updatedProfileData).toEqual([{ display_name: 'user2' }]);

        await TestFixture.getClient()
            .from('user_profiles')
            .update({ display_name: 'user1@example.com' })
            .eq('id', (profileData![0] as { id: string }).id);
    });

    it('should not allow users to update other users user_profiles', async () => {
        await TestFixture.logIn('user2@example.com', 'password123');

        const { data: profileData } = await TestFixture.getClient()
            .from('user_profiles')
            .select('id')
            .eq('display_name', 'user1@example.com');

        const { data: updatedProfileData, error: updateError } =
            await TestFixture.getClient()
                .from('user_profiles')
                .update({ display_name: 'user2 changed this' })
                .eq('id', (profileData![0] as { id: string }).id)
                .select('display_name');

        expect(updateError).toBeNull();
        expect(updatedProfileData).toEqual([]);

        const { data: originalProfileData } = await TestFixture.getClient()
            .from('user_profiles')
            .select('display_name')
            .eq('id', (profileData![0] as { id: string }).id);

        expect(originalProfileData).toEqual([
            { display_name: 'user1@example.com' },
        ]);
    });

    it('should create a user profile when a user in auth.users is created', async () => {
        await TestFixture.logIn('user1@example.com', 'password123');
        const { data: userData } = await TestFixture.getClient().auth.getUser();

        const { data: profileData, error: profileError } =
            await TestFixture.getClient()
                .from('user_profiles')
                .select('*')
                .eq('display_name', 'user1@example.com')
                .single();

        expect(profileError).toBeNull();
        expect(profileData).toEqual({
            id: expect.stringMatching(uuidRegex),
            user_id: userData.user!.id,
            display_name: 'user1@example.com',
            created_at: expect.stringMatching(dateRegex),
            updated_at: expect.stringMatching(dateRegex),
        });
    });
});
