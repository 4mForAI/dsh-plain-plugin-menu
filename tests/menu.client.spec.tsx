// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PluginMenu } from '../src/client/PluginMenu.tsx'
import { zh } from '../src/client/locales.ts'
import type { CatalogResponse, InstalledResponse } from '../src/types.ts'

const catalog: CatalogResponse = {
  source: 'snapshot',
  syncedAt: '2026-08-16T00:00:00Z',
  registryUpdatedAt: '2026-08-16',
  plugins: [
    {
      id: 'acme/guard|guard', name: 'guard', owner: 'acme', repo: 'acme/guard',
      url: 'https://github.com/acme/guard', description: { zh: '保护插件操作', en: 'Protect plugin operations' },
      category: 'safety', sourceCategory: 'dev', installTarget: 'github:acme/guard', npm: null,
      stars: 42, forks: 3, openIssues: 1, maintenanceAt: '2026-08-15T00:00:00Z',
      addedAt: '2026-08-16', license: 'MIT', archived: false, curated: true, topics: ['security'],
    },
    {
      id: 'acme/theme|theme', name: 'theme', owner: 'acme', repo: 'acme/theme',
      url: 'https://github.com/acme/theme', description: { zh: '换个皮肤', en: 'Change the theme' },
      category: 'skin', sourceCategory: 'theme', installTarget: 'github:acme/theme', npm: null,
      stars: 10, forks: 1, openIssues: 0, maintenanceAt: null,
      addedAt: '2026-08-15', license: null, archived: false, curated: true, topics: ['theme'],
    },
  ],
}

const installed: InstalledResponse = { profile: 'web', dependencies: [], restartRequired: false }

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('plugin menu', () => {
  it('renders the plain-language catalog and filters it', async () => {
    vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => ({
      ok: true,
      json: async () => String(input).includes('catalog') ? catalog : installed,
    })))
    const store = {
      getSnapshot: () => true,
      subscribe: () => () => {},
      setOpen: vi.fn(),
    }
    class TestLocale {
      private readonly listeners = new Set<() => void>()
      private readonly snapshot = { active: 'zh' }

      getSnapshot(): { active: string } {
        return this.snapshot
      }

      subscribe(listener: () => void): () => void {
        this.listeners.add(listener)
        return () => { this.listeners.delete(listener) }
      }
    }
    const locale = new TestLocale()
    render(<PluginMenu
      t={key => zh[key] ?? key}
      locale={locale}
      store={store}
    />)

    expect(screen.getByRole('dialog')).toBeTruthy()
    await waitFor(() => expect(screen.getByText('guard')).toBeTruthy())
    expect(screen.getByText('theme')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /安全守门/ }))
    expect(screen.getByText('guard')).toBeTruthy()
    expect(screen.queryByText('theme')).toBeNull()

    fireEvent.change(screen.getByPlaceholderText('搜名字、功能或作者'), { target: { value: 'missing' } })
    expect(screen.getByText('没找到符合条件的插件。')).toBeTruthy()
  })
})
