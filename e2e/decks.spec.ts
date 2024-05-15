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

test('should display decks in the sidebar', async ({ page }) => {
    await expect(page).toHaveURL('http://localhost:3000/decks');
    await expect(
        page.locator('a[data-testid="sidebar-deck"]:has-text("Private deck")'),
    ).toBeVisible();
    await expect(
        page.locator('a[data-testid="sidebar-deck"]:has-text("Deck 1")'),
    ).toBeVisible();
});

test('should go to the deck page', async ({ page }) => {
    await page
        .locator('a[data-testid="sidebar-deck"]:has-text("Private deck")')
        .click();
    await expect(page).toHaveURL(
        /http:\/\/localhost:3000\/decks\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/,
    );
    await expect(page).toHaveScreenshot();

    await expect(page.locator('h3').getByText('Private deck')).toBeVisible();
    await expect(
        page.locator('p').getByText('Description for private deck'),
    ).toBeVisible();
});

test('should be able to publish a deck', async ({ page }) => {
    await page
        .locator('a[data-testid="sidebar-deck"]:has-text("Private deck")')
        .click();
    await expect(page).toHaveURL(
        /http:\/\/localhost:3000\/decks\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/,
    );
    await page.locator('[data-testid="toggle"]').click();
    await expect(page).toHaveScreenshot();

    await expect(
        await page.locator('[data-testid="toggle"]').isChecked(),
    ).toBeTruthy();
});
