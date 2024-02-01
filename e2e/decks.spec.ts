import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.fill('input[name="email"]', 'user1@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Log in")');
});

test('should add a new deck', async ({ page }) => {
    await page.click('button:has-text("Add")');
    await expect(page).toHaveURL('http://localhost:3000/decks/new');
    await expect(page).toHaveScreenshot();

    await page.fill('input[name="name"]', 'My new deck');
    await page.fill('input[name="description"]', 'My new deck description');
    await page.getByText('Create deck').click();
    await expect(page).toHaveURL('http://localhost:3000/decks');

    await expect(page.locator('h3').getByText('My new deck')).toBeVisible();
    await expect(page.getByText('My new deck description')).toBeVisible();
});
