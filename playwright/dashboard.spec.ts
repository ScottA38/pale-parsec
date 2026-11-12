import { test, expect } from '@playwright/test';

test('index page has a menu with appropriate items' , async ({ page }) => {
  await page.goto('http://localhost:4321/');

  await expect(page.frameLocator(''));
});

test('does display post-card on dashboard', async ({ page }) => {
  await page.route('*/**/api/updates.json', async route => {
    const json = [
      {
        content: {
          title: 'blob-1',
          subheading: "wysiwg",
          body: 'this is blob-1\'s content',
          userId: "adskjhbf123456789",
          image: ['data:image/jpeg;base64,/9j/4Q/+RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEo'],
          tags: ['tag-1', 'tag-2'],
        }
      },
      {
        content: {
          title: '2 blob 4u1 ',
          subheading: "takeaway",
          body: 'this is blob-2\'s content',
          userId: "adskjhbf123456789",
          image: ['data:image/jpeg;base64,/9j/4Q/+RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgED'],
          tags: ['tag-1', 'tag-2'],
        }
      },
    ];

    await route.fulfill({ json });
  });

  await page.goto('http://localhost:4321/dashboard');
  await expect(page).toHaveTitle(/A Band blog page/);
  await page.getByRole('article', { name: 'Post title' })

  await expect(await page.content)
});

test('it should have a title as ascertained by page props', async ({ page }) => {

})

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
