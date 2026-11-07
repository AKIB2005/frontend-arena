import { expect, test, type Page } from '@playwright/test'

const routes = ['/discover', '/dashboard', '/tracker', '/compare']

function contrastRatio(foreground: string, background: string) {
  const channel = (value: string, offset: number) => {
    const component = Number(value.slice(offset, offset + 2)) / 255
    return component <= 0.03928
      ? component / 12.92
      : ((component + 0.055) / 1.055) ** 2.4
  }
  const luminance = (value: string) => {
    const hex = value
      .replace(/^rgba?\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .map((part) => Number(part.trim()).toString(16).padStart(2, '0'))
      .join('')
    return (
      0.2126 * channel(hex, 0) +
      0.7152 * channel(hex, 2) +
      0.0722 * channel(hex, 4)
    )
  }
  const light = Math.max(luminance(foreground), luminance(background))
  const dark = Math.min(luminance(foreground), luminance(background))
  return (light + 0.05) / (dark + 0.05)
}

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

async function assertDiscoverHoverContrast(page: Page) {
  const list = page.getByRole('region', { name: /^\d+ scholarships$/ })
  const cards = list.locator('[data-testid="scholarship-card"]')
  await list.hover({ position: { x: 12, y: 12 }, force: true })

  for (let index = 0; index < (await cards.count()); index += 1) {
    const card = cards.nth(index)
    await card.scrollIntoViewIfNeeded()
    await card.hover({ force: true })
    const colors = await card.evaluate((element) => ({
      background: getComputedStyle(element).backgroundColor,
      title: getComputedStyle(
        element.querySelector('[data-testid="scholarship-title"]')!,
      ).color,
    }))
    expect(colors.title).not.toBe(colors.background)
    expect(contrastRatio(colors.title, colors.background)).toBeGreaterThanOrEqual(
      4.5,
    )
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
        if (route === '/discover') await assertDiscoverHoverContrast(page)
        await page.screenshot({
          path: `docs/qa/hover/${theme}-${route.slice(1) || 'home'}.png`,
          fullPage: true,
        })
      })
    }
  })
}
