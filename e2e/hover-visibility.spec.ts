import { expect, test, type Page } from '@playwright/test'

const routes = ['/discover', '/dashboard', '/tracker', '/compare']

function contrastRatio(foreground: string, background: string) {
  const channel = (value: number) => {
    const component = value / 255
    return component <= 0.03928
      ? component / 12.92
      : ((component + 0.055) / 1.055) ** 2.4
  }
  const luminance = (value: string) => {
    const [r, g, b] = (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
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

async function assertDiscoverCardsSurviveScroll(page: Page) {
  const filter = page.getByRole('region', { name: 'Search and filters' })
  const cards = page.locator('[data-testid="scholarship-card"]')
  const maxScroll = await page.evaluate(
    () => document.documentElement.scrollHeight - window.innerHeight,
  )
  const positions = [
    ...Array.from(
      { length: Math.floor(maxScroll / 320) + 1 },
      (_, index) => index * 320,
    ),
    maxScroll,
  ]

  for (const position of [...new Set(positions)]) {
    await page.evaluate((scrollTop) => window.scrollTo(0, scrollTop), position)
    await page.waitForTimeout(50)
    await filter.waitFor()
    const filterBox = await filter.boundingBox()
    expect(filterBox).not.toBeNull()
    const states = await cards.evaluateAll((elements) => {
      const viewportHeight = window.innerHeight
      return elements.map((element) => {
        const title = element.querySelector<HTMLElement>(
          '[data-testid="scholarship-title"]',
        )
        const cardBox = element.getBoundingClientRect()
        const titleBox = title?.getBoundingClientRect()
        const titleStyle = title ? getComputedStyle(title) : null
        return {
          opacity: getComputedStyle(element).opacity,
          cardBox: { top: cardBox.top, bottom: cardBox.bottom },
          titleBox: titleBox
            ? {
                top: titleBox.top,
                bottom: titleBox.bottom,
                height: titleBox.height,
              }
            : null,
          titleVisible:
            titleStyle?.display !== 'none' &&
            titleStyle?.visibility !== 'hidden' &&
            titleStyle?.opacity !== '0',
          inViewport: cardBox.bottom > 0 && cardBox.top < viewportHeight,
        }
      })
    })
    for (const state of states) {
      expect(state.opacity).toBe('1')
      expect(state.titleVisible).toBe(true)
      expect(state.titleBox?.height).toBeGreaterThan(0)
      if (
        state.inViewport &&
        state.titleBox &&
        filterBox &&
        state.titleBox.top < filterBox.bottom &&
        state.titleBox.bottom > filterBox.top
      ) {
        expect(state.titleBox.top).toBeGreaterThanOrEqual(filterBox.bottom)
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
        if (route === '/discover') await assertDiscoverHoverContrast(page)
        await page.screenshot({
          path: `docs/qa/hover/${theme}-${route.slice(1) || 'home'}.png`,
          fullPage: true,
        })
      })
    }

    for (const reducedMotion of [false, true]) {
      test(`keeps every card visible while scrolling with reduced motion ${reducedMotion ? 'on' : 'off'}`, async ({
        page,
      }) => {
        await page.goto('/discover')
        if (theme === 'dark')
          await page.getByRole('button', { name: 'Dark mode' }).click()
        if (reducedMotion)
          await page
            .getByRole('banner')
            .getByRole('button', { name: 'Reduce motion' })
            .click()
        await page.locator('[data-testid="scholarship-card"]').first().waitFor()
        await assertDiscoverCardsSurviveScroll(page)
      })
    }
  })
}
