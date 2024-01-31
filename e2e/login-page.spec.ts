import { expect, test } from '@playwright/test';

test('should redirect to the login page when not logged in', async ({
    page,
}) => {
    await page.goto('http://localhost:3000/');

    await expect(page).toHaveURL('http://localhost:3000/login');
    await expect(page).toHaveTitle('Log in | Flashcards');
    await expect(page).toHaveScreenshot();
});

test('should allow a user to go to the signup page', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.getByText('Sign up').click();

    await expect(page).toHaveURL('http://localhost:3000/login/sign-up');
    await expect(page).toHaveTitle('Sign up | Flashcards');
    await expect(page).toHaveScreenshot();
});

test('should redirect to the dashboard after logging in', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    await page.fill('input[name="email"]', 'user1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Log in")');

    await expect(page).toHaveURL('http://localhost:3000/decks');
    await expect(page).toHaveTitle('Decks | Flashcards');
    await expect(page).toHaveScreenshot();
});
