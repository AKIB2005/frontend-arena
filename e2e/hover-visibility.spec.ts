import { expect, test, type Page } from '@playwright/test'

const routes = ['/discover', '/dashboard', '/tracker', '/compare']

async function assertVisibleFields(page: Page) {
  const cards = page.locator('article')
  for (let index = 0; index < (await cards.count()); index += 1) {
    const card = cards.nth(index)
    await card.scrollIntoViewIfNeeded()
    await card.hover({ force: true })
    await card.focus()
    for (const selector of [
      '[data-testid="scholarship-title"]',
      '[data-testid="scholarship-provider"]',
      '[data-testid="scholarship-amount"]',
      '[data-testid="scholarship-deadline"]',
      '[data-testid="quick-view-title"]',
      '[data-testid="quick-view-provider"]',
      '[data-testid="quick-view-amount"]',
      '[data-testid="quick-view-deadline"]',
    ]) {
      const field = card.locator(selector)
      if (await field.count()) {
        await expect(field).toBeVisible()
        await expect(field).toHaveCSS('opacity', '1')
        await expect(field).not.toHaveCSS('visibility', 'hidden')
      }
    }
  }
}

for (const theme of ['light', 'dark']) {
  test.describe(`${theme} hover visibility`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/discover')
      if (theme === 'dark')
        await page.getByRole('button', { name: 'Dark mode' }).click()
      await page.locator('[data-testid="scholarship-card"]').first().waitFor()
    })

    for (const route of routes) {
      test(`keeps card content readable on ${route}`, async ({ page }) => {
        await page.goto(route)
        await assertVisibleFields(page)
        await page.screenshot({
          path: `docs/qa/hover/${theme}-${route.slice(1) || 'home'}.png`,
          fullPage: true,
        })
      })
    }
  })
}
