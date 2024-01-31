import { expect, test } from '@playwright/test';

test('should redirect to the login page when not logged in', async ({
    page,
}) => {
    await page.goto('http://localhost:3000/');

    await expect(page).toHaveURL('http://localhost:3000/login');
    await expect(page).toHaveTitle('Log in | Flashcards');
});
