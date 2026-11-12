import { type Page, type Route, test, expect,  } from '@playwright/test';

test('Page title is pulled from config', async ({ page }) => {
  await page.goto('http://localhost:8888/');

  await expect(await page.title()).toEqual('A band\'s blog');
});

test('page has subheading', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  
  const subheading = await page.locator('h2.site.subheading');

  await expect(await subheading.textContent()).toMatch(/Seekers\, searchers and heathens\./);
});

test('Index page has a menu bar', async ({ page }) => {
  await page.goto('http://localhost:4321/');
  const nav = await page.getByRole('navigation');

  await expect(await nav.locator('ol li')).toHaveCount(4);
});

test('it has intro text', async ({ page }) => {

})

test('the nav will open horizontally when viewed from a mobile device', async ({ page, isMobile }) => {
  test.skip(isMobile !== true);
  await page.goto('http://localhost:4321/');

  const nav = await page.getByRole('navigation');
  const navList = await nav.locator('ol');

  expect(navList)
})