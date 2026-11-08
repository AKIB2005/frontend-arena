import { expect, test } from '@playwright/test'

test('Discover labels and filters scholarship records', async ({ page }) => {
  await page.goto('/discover')
  const cards = page.getByTestId('scholarship-card')
  await expect(cards.first()).toBeVisible()
  await expect(cards.first().getByText('Sample', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: /Filters/ }).click()
  await page.getByLabel('Show').selectOption('real')
  await expect(page.getByText('No real records match. Try All.')).toBeVisible()

  await page.getByLabel('Show').selectOption('all')
  const closed = page.locator('details').filter({ hasText: /^Closed/ })
  if (await closed.count()) {
    await expect(closed.first()).toBeVisible()
  }

  const sourceLinks = page.getByRole('link', { name: /Check official page:/ })
  for (let i = 0; i < (await sourceLinks.count()); i += 1) {
    await expect(sourceLinks.nth(i)).toHaveAttribute('href', /^https:\/\//)
  }
})
