import { expect, Page, test } from '@playwright/test';

const logInAs =
    (email: string, password: string) =>
    async ({ page }: { page: Page }) => {
        await page.goto('http://localhost:3000/');
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', password);
        await page.click('button:has-text("Log in")');
    };

const logInAsUserN = (n: number) =>
    logInAs(`user${n}@example.com`, 'password123');

test('should add a new deck', async ({ page }) => {
    await logInAsUserN(1)({ page });
    await page.goto('http://localhost:3000/decks');
    await page.click('button:has-text("Add")');
    await expect(page).toHaveURL('http://localhost:3000/decks/new');
    await page
        .locator('[data-testid="breadcrumbs-root"]')
        .waitFor({ state: 'attached' });
    await expect(page).toHaveScreenshot();

    await page.fill('input[name="name"]', 'My new deck');
    await page.fill('input[name="description"]', 'My new deck description');
    await page.getByText('Create deck').click();
    await expect(page).toHaveURL('http://localhost:3000/decks');

    await expect(page.locator('h3').getByText('My new deck')).toBeVisible();
    await expect(page.getByText('My new deck description')).toBeVisible();
    await page
        .locator('[data-testid="breadcrumbs-root"]')
        .waitFor({ state: 'attached' });

    await expect(page).toHaveURL('http://localhost:3000/decks');
    await expect(page).toHaveScreenshot();
});

test('should display decks in the sidebar', async ({ page }) => {
    await logInAsUserN(2)({ page });
    await expect(page).toHaveURL('http://localhost:3000/decks');
    await page.click('button:has-text("Add")');
    await expect(page).toHaveURL('http://localhost:3000/decks/new');
    await page.fill('input[name="name"]', 'My new deck');
    await page.fill('input[name="description"]', 'My new deck description');
    await page.getByText('Create deck').click();

    await expect(
        page.locator('a[data-testid="sidebar-deck"]:has-text("My new deck")'),
    ).toBeVisible();
});

test('should go to the deck page', async ({ page }) => {
    await logInAsUserN(3)({ page });
    await expect(page).toHaveURL('http://localhost:3000/decks');
    await page.click('button:has-text("Add")');
    await expect(page).toHaveURL('http://localhost:3000/decks/new');
    await page.fill('input[name="name"]', 'My new deck');
    await page.fill('input[name="description"]', 'My new deck description');
    await page.getByText('Create deck').click();
    await page
        .locator('a[data-testid="sidebar-deck"]:has-text("My new deck")')
        .click();
    await expect(page).toHaveURL(
        /http:\/\/localhost:3000\/decks\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/,
    );
    await expect(page).toHaveScreenshot();

    await expect(page.locator('h3').getByText('My new deck')).toBeVisible();
    await expect(
        page.locator('p').getByText('My new deck description'),
    ).toBeVisible();
});

test('should be able to publish a deck', async ({ page }) => {
    await logInAsUserN(4)({ page });
    await page.click('button:has-text("Add")');
    await expect(page).toHaveURL('http://localhost:3000/decks/new');
    await page.fill('input[name="name"]', 'My new deck');
    await page.fill('input[name="description"]', 'My new deck description');
    await page.getByText('Create deck').click();
    await page
        .locator('a[data-testid="sidebar-deck"]:has-text("My new deck")')
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

test('should allow renaming a deck', async ({ page }) => {
    await logInAsUserN(5)({ page });
    await page.goto('http://localhost:3000/decks');
    await page.click('text=My new deck');
    await expect(page).toHaveURL(
        /http:\/\/localhost:3000\/decks\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/,
    );
    await page.click('text=Rename');
    await page.fill('input[name="newDeckName"]', 'My renamed deck');
    await page.click('text=Save');
    await expect(page.locator('h3')).toHaveText('My renamed deck');
});
