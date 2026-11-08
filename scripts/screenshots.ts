import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import { createServer } from 'node:net'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium, type Browser, type BrowserContext, type Page } from '@playwright/test'

type Capture = {
  name: string
  theme: 'light' | 'dark'
  width: number
  height: number
  deviceScaleFactor: number
  isMobile: boolean
}

const captures: Capture[] = [
  {
    name: 'light-desktop',
    theme: 'light',
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false,
  },
  {
    name: 'dark-desktop',
    theme: 'dark',
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false,
  },
  {
    name: 'mobile',
    theme: 'light',
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
  },
]

const root = new URL('..', import.meta.url)
const outputDirectory = new URL('../docs/screenshots/', import.meta.url)
const rootPath = fileURLToPath(root)
const configuredBaseUrl = process.env.BASE_URL?.replace(/\/+$/, '')
let targetBaseUrl = configuredBaseUrl

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(4173, '127.0.0.1', () => {
      const address = server.address()
      if (!address || typeof address === 'string') {
        server.close()
        reject(new Error('Could not determine preview port'))
        return
      }
      const port = address.port
      server.close(() => resolve(port))
    })
  })
}

async function waitForServer(url: string): Promise<void> {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok || response.status < 500) return
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`Preview did not respond at ${url}`)
}

function stopServer(server: ChildProcess | undefined): void {
  if (!server || server.killed) return
  server.kill()
}

async function preparePage(page: Page, capture: Capture): Promise<void> {
  await page.addInitScript(({ theme }) => {
    localStorage.setItem('grantly-theme', theme)
    localStorage.setItem('grantly-reduce-motion', '1')
    sessionStorage.clear()
  }, { theme: capture.theme })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${targetBaseUrl}/discover`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.locator('[data-testid="scholarship-card"]').nth(2).waitFor()
  await page.locator('[role="dialog"]').evaluateAll((dialogs) => {
    for (const dialog of dialogs) {
      const close = dialog.querySelector<HTMLButtonElement>('button')
      close?.click()
    }
  })
  await page.keyboard.press('Escape')
  await page.mouse.move(0, 0)
  await page.evaluate(() => window.scrollTo(0, 0))

  const expectedDark = capture.theme === 'dark'
  const hasDarkClass = await page.evaluate(() =>
    document.documentElement.classList.contains('dark'),
  )
  if (hasDarkClass !== expectedDark) {
    throw new Error(
      `${capture.name}: expected documentElement.dark=${expectedDark}, got ${hasDarkClass}`,
    )
  }

  const readable = await page.locator('[data-testid="scholarship-card"]').evaluateAll(
    (cards) =>
      cards.slice(0, 3).map((card) => {
        const title = card.querySelector('[data-testid="scholarship-title"]')
        if (!title) return { readable: false, foreground: '', background: '', ratio: 0 }
        const titleStyle = getComputedStyle(title)
        const cardStyle = getComputedStyle(card)
        const foreground = titleStyle.color
        const background = cardStyle.backgroundColor
        const values = (value: string) =>
          (value.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
        const [fr, fg, fb] = values(foreground)
        const [br, bg, bb] = values(background)
        const channel = (value: number) => {
          const normalized = value / 255
          return normalized <= 0.03928
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4
        }
        const foregroundLuminance =
          0.2126 * channel(fr) + 0.7152 * channel(fg) + 0.0722 * channel(fb)
        const backgroundLuminance =
          0.2126 * channel(br) + 0.7152 * channel(bg) + 0.0722 * channel(bb)
        const light = Math.max(foregroundLuminance, backgroundLuminance)
        const dark = Math.min(foregroundLuminance, backgroundLuminance)
        return {
          readable: (light + 0.05) / (dark + 0.05) >= 4.5,
          foreground,
          background,
          ratio: (light + 0.05) / (dark + 0.05),
        }
      }),
  )
  if (readable.some((card) => !card.readable)) {
    throw new Error(`${capture.name}: scholarship title contrast failed: ${JSON.stringify(readable)}`)
  }
  console.log(`${capture.name}: dark=${hasDarkClass}, title contrast=${readable.map((card) => card.ratio.toFixed(2)).join(', ')}`)
}

async function verifyPng(path: URL, capture: Capture): Promise<number> {
  const buffer = await readFile(path)
  const signature = '89504e470d0a1a0a'
  if (buffer.subarray(0, 8).toString('hex') !== signature) {
    throw new Error(`${capture.name}: output is not a PNG`)
  }
  if (buffer.readUInt32BE(12) !== 0x49484452) {
    throw new Error(`${capture.name}: PNG is missing IHDR`)
  }
  const width = buffer.readUInt32BE(16)
  const height = buffer.readUInt32BE(20)
  const expectedWidth = capture.width * capture.deviceScaleFactor
  const expectedHeight = capture.height * capture.deviceScaleFactor
  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(
      `${capture.name}: expected ${expectedWidth}x${expectedHeight}, got ${width}x${height}`,
    )
  }
  if (!buffer.length) throw new Error(`${capture.name}: output is empty`)
  return buffer.length
}

async function capture(browser: Browser, captureConfig: Capture): Promise<number> {
  const context: BrowserContext = await browser.newContext({
    viewport: { width: captureConfig.width, height: captureConfig.height },
    deviceScaleFactor: captureConfig.deviceScaleFactor,
    isMobile: captureConfig.isMobile,
    colorScheme: captureConfig.theme,
  })
  const page = await context.newPage()
  try {
    await preparePage(page, captureConfig)
    const path = new URL(`./${captureConfig.name}.png`, outputDirectory)
    await page.screenshot({ path: fileURLToPath(path), type: 'png' })
    const size = await verifyPng(path, captureConfig)
    console.log(`${captureConfig.name}: ${Math.round(size / 1024)} KB`)
    return size
  } finally {
    await context.close()
  }
}

async function main(): Promise<void> {
  let server: ChildProcess | undefined
  if (!targetBaseUrl) {
    const npmCommand =
      process.platform === 'win32' ? process.env.ComSpec ?? 'cmd.exe' : 'npm'
    const npmArgs =
      process.platform === 'win32'
        ? ['/d', '/s', '/c', 'npm run build']
        : ['run', 'build']
    execFileSync(npmCommand, npmArgs, { cwd: rootPath, stdio: 'inherit' })
    const port = await freePort()
    targetBaseUrl = `http://127.0.0.1:${port}`
    const previewArgs =
      process.platform === 'win32'
        ? ['/d', '/s', '/c', `npm run preview -- --host 127.0.0.1 --port ${port}`]
        : ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port)]
    server = spawn(npmCommand, previewArgs, {
      cwd: rootPath,
      stdio: 'inherit',
    })
    await waitForServer(`${targetBaseUrl}/discover`)
  }
  if (!targetBaseUrl) throw new Error('No capture URL available')
  const browser = await chromium.launch()
  try {
    for (const captureConfig of captures) {
      let config = captureConfig
      let size = await capture(browser, config)
      if (size > 600 * 1024) {
        if (config.deviceScaleFactor === 1) {
          throw new Error(`${config.name}: screenshot is larger than 600 KB`)
        }
        config = { ...config, deviceScaleFactor: 1 }
        size = await capture(browser, config)
        if (size > 600 * 1024) {
          throw new Error(`${config.name}: screenshot is still larger than 600 KB at scale 1`)
        }
      }
    }
  } finally {
    await browser.close()
    stopServer(server)
  }
}

await main()
