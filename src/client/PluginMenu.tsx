import {
  useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore,
  type ReactNode,
} from 'react'
import React from 'react'
import type {
  CatalogPlugin, CatalogResponse, InstalledDependency, InstalledResponse,
  OperationResponse, PlainCategoryId,
} from '../types.ts'
import { menuStore } from './menu-store.ts'
import css from './PluginMenu.module.css'

type Translate = (key: string) => string

interface LocaleLike {
  subscribe(listener: () => void): () => void
  getSnapshot(): { active: string }
}

interface MenuStoreLike {
  getSnapshot(): boolean
  subscribe(listener: () => void): () => void
  setOpen(value: boolean): void
}

const CATEGORIES: ReadonlyArray<{ id: PlainCategoryId; icon: string; zh: string; en: string }> = [
  { id: 'skin', icon: '◐', zh: '皮肤和界面', en: 'Looks & layout' },
  { id: 'research', icon: '⌕', zh: '查资料', en: 'Research' },
  { id: 'code', icon: '</>', zh: '写代码', en: 'Coding' },
  { id: 'vision', icon: '◉', zh: '看图做图', en: 'Images & design' },
  { id: 'memory', icon: '◇', zh: '记住事情', en: 'Memory' },
  { id: 'automation', icon: '↻', zh: '自动干活', en: 'Automation' },
  { id: 'messages', icon: '↗', zh: '发消息', en: 'Notifications' },
  { id: 'files', icon: '▱', zh: '管文件', en: 'Files & docs' },
  { id: 'models', icon: '◎', zh: '接模型', en: 'Models' },
  { id: 'safety', icon: '⬡', zh: '安全守门', en: 'Safety' },
  { id: 'skills', icon: '✦', zh: '小技能', en: 'Skills' },
  { id: 'chat', icon: '◌', zh: '聊得更顺', en: 'Chat helpers' },
  { id: 'fun', icon: '☺', zh: '玩点花的', en: 'Just for fun' },
  { id: 'plugins', icon: '▦', zh: '管插件', en: 'Plugin tools' },
  { id: 'other', icon: '…', zh: '其他', en: 'Other' },
]

let cachedCatalog: CatalogResponse | null = null
let cachedInstalled: InstalledResponse | null = null

function menuIcon(): ReactNode {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <rect x="2" y="2" width="6" height="6" rx="2" fill="currentColor" />
      <rect x="12" y="2" width="6" height="6" rx="2" fill="currentColor" opacity=".55" />
      <rect x="2" y="12" width="6" height="6" rx="2" fill="currentColor" opacity=".55" />
      <path d="M15 11v7m-3.5-3.5h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function PluginMenuTrigger({ wide, t }: { wide: boolean; t: Translate }): ReactNode {
  return (
    <button className={css.trigger} type="button" title={t('menuHint')} onClick={() => menuStore.setOpen(true)}>
      <span className={css.triggerIcon}>{menuIcon()}</span>
      {wide ? <span className={css.triggerLabel}>{t('menu')}</span> : null}
    </button>
  )
}

function request<T>(path: string, init?: RequestInit): Promise<T> {
  return fetch(path, { cache: 'no-store', ...init }).then(async response => {
    const body = await response.json() as T & { message?: string }
    if (!response.ok) throw new Error(body.message ?? `HTTP ${response.status}`)
    return body
  })
}

function mutate<T>(path: string, body: unknown): Promise<T> {
  return request(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-dsh-plugin-menu': '1' },
    body: JSON.stringify(body),
  })
}

function repoFromSpec(spec: string): string | null {
  const match = /github:([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/i.exec(spec)
  return match?.[1]?.toLocaleLowerCase() ?? null
}

function installedMatch(plugin: CatalogPlugin, installed: InstalledDependency[]): InstalledDependency | undefined {
  if (plugin.npm !== null) {
    const exact = installed.find(item => item.name.toLocaleLowerCase() === plugin.npm?.toLocaleLowerCase())
    if (exact !== undefined) return exact
  }
  const repo = plugin.repo.toLocaleLowerCase()
  return installed.find(item => repoFromSpec(item.spec) === repo
    || item.name.toLocaleLowerCase() === plugin.name.toLocaleLowerCase())
}

function compactNumber(value: number, language: string): string {
  return new Intl.NumberFormat(language, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

function maintenanceLabel(value: string | null, language: string, t: Translate): string {
  if (value === null) return t('unknownMaintenance')
  const days = Math.max(0, Math.floor((Date.now() - Date.parse(value)) / 86_400_000))
  if (language === 'zh') {
    if (days === 0) return '今天维护'
    if (days < 30) return `${days} 天前维护`
    if (days < 365) return `${Math.floor(days / 30)} 个月前维护`
    return `${Math.floor(days / 365)} 年前维护`
  }
  if (days === 0) return 'Maintained today'
  if (days < 30) return `Maintained ${days}d ago`
  if (days < 365) return `Maintained ${Math.floor(days / 30)}mo ago`
  return `Maintained ${Math.floor(days / 365)}y ago`
}

function signal(plugin: CatalogPlugin, language: string): { tone: string; label: string } {
  if (plugin.archived) return { tone: 'danger', label: language === 'zh' ? '已归档' : 'Archived' }
  if (plugin.maintenanceAt === null) return { tone: 'muted', label: language === 'zh' ? '信息不全' : 'Limited data' }
  const days = (Date.now() - Date.parse(plugin.maintenanceAt)) / 86_400_000
  if (days <= 90) return { tone: 'good', label: language === 'zh' ? '最近有人维护' : 'Recently maintained' }
  if (days <= 365) return { tone: 'neutral', label: language === 'zh' ? '还在维护' : 'Maintained' }
  return { tone: 'warn', label: language === 'zh' ? '很久没更新' : 'Quiet for a while' }
}

function categoryMeta(id: PlainCategoryId, language: string): (typeof CATEGORIES)[number] {
  const value = CATEGORIES.find(item => item.id === id) ?? CATEGORIES[CATEGORIES.length - 1]!
  return { ...value, zh: language === 'zh' ? value.zh : value.en } as (typeof CATEGORIES)[number]
}

function PluginCard({
  plugin, dependency, language, t, busy, armed, onArm, onInstall,
}: {
  plugin: CatalogPlugin
  dependency: InstalledDependency | undefined
  language: string
  t: Translate
  busy: boolean
  armed: boolean
  onArm(): void
  onInstall(): void
}): ReactNode {
  const status = signal(plugin, language)
  const category = categoryMeta(plugin.category, language)
  return (
    <article className={css.card} data-archived={plugin.archived ? 'true' : undefined}>
      <div className={css.cardTop}>
        <div className={css.avatar}>{plugin.name.replace(/^dsh[-_]/i, '').charAt(0).toUpperCase() || 'P'}</div>
        <div className={css.cardIdentity}>
          <h3 title={plugin.name}>{plugin.name}</h3>
          <span>{plugin.owner}</span>
        </div>
        <span className={css.categoryBadge}><b>{category.icon}</b>{category.zh}</span>
      </div>
      <p className={css.description}>{language === 'zh' ? plugin.description.zh : plugin.description.en}</p>
      <div className={css.signalRow}>
        <span className={css.signal} data-tone={status.tone}><i />{status.label}</span>
        <span>★ {compactNumber(plugin.stars, language)}</span>
        <span>{maintenanceLabel(plugin.maintenanceAt, language, t)}</span>
        <span>{plugin.license ?? t('noLicense')}</span>
      </div>
      <div className={css.cardFoot}>
        <a href={plugin.url} target="_blank" rel="noreferrer">{t('details')} ↗</a>
        {dependency !== undefined ? (
          <span className={css.installedPill}>✓ {t('installedTag')}</span>
        ) : armed ? (
          <div className={css.confirmActions}>
            <button type="button" className={css.secondaryButton} onClick={onArm}>{t('cancel')}</button>
            <button type="button" className={css.primaryButton} disabled={busy} onClick={onInstall}>
              {busy ? t('installing') : t('confirmInstall')}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={css.primaryButton}
            disabled={plugin.installTarget === null || plugin.archived || busy}
            onClick={onArm}
          >{t('install')}</button>
        )}
      </div>
      {armed ? <p className={css.warning}>{t('installWarning')}</p> : null}
    </article>
  )
}

function InstalledCard({
  dependency, t, armed, busy, onArm, onRemove,
}: {
  dependency: InstalledDependency
  t: Translate
  armed: boolean
  busy: boolean
  onArm(): void
  onRemove(): void
}): ReactNode {
  return (
    <article className={css.installedCard}>
      <div className={css.installedMain}>
        <div className={css.avatar}>{dependency.name.replace(/^@.*\//, '').charAt(0).toUpperCase()}</div>
        <div>
          <h3>{dependency.name}</h3>
          <p>{dependency.version === null ? dependency.spec : `${t('version')} ${dependency.version}`}</p>
        </div>
      </div>
      <div className={css.installedSignals}>
        <span data-active={dependency.active ? 'true' : 'false'}><i />{dependency.active ? t('active') : t('inactive')}</span>
        {!dependency.bundle ? <span>{t('noBundle')}</span> : null}
      </div>
      <div className={css.installedActions}>
        {dependency.repository !== null ? <a href={dependency.repository.replace(/^git\+/, '').replace(/\.git$/, '')} target="_blank" rel="noreferrer">{t('details')} ↗</a> : <span />}
        {armed ? (
          <div className={css.confirmActions}>
            <button type="button" className={css.secondaryButton} onClick={onArm}>{t('cancel')}</button>
            <button type="button" className={css.dangerButton} disabled={busy} onClick={onRemove}>
              {busy ? t('removing') : t('confirmRemove')}
            </button>
          </div>
        ) : <button type="button" className={css.removeButton} disabled={busy} onClick={onArm}>{t('remove')}</button>}
      </div>
    </article>
  )
}

export interface PluginMenuProps {
  t: Translate
  locale: LocaleLike
  store: MenuStoreLike
}

export function PluginMenu({ t, locale, store }: PluginMenuProps): ReactNode {
  // DSH exposes locale as a class instance. Passing its methods directly to
  // useSyncExternalStore loses the receiver when React invokes them, so keep
  // the service call bound through stable wrappers.
  const subscribeToMenu = useCallback((listener: () => void) => store.subscribe(listener), [store])
  const readMenu = useCallback(() => store.getSnapshot(), [store])
  const subscribeToLocale = useCallback((listener: () => void) => locale.subscribe(listener), [locale])
  const readLocale = useCallback(() => locale.getSnapshot(), [locale])
  const open = useSyncExternalStore(subscribeToMenu, readMenu)
  const localeSnapshot = useSyncExternalStore(subscribeToLocale, readLocale)
  const language = localeSnapshot.active.toLocaleLowerCase().startsWith('zh') ? 'zh' : 'en'
  const [catalog, setCatalog] = useState<CatalogResponse | null>(cachedCatalog)
  const [installed, setInstalled] = useState<InstalledResponse | null>(cachedInstalled)
  const [loading, setLoading] = useState(cachedCatalog === null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'browse' | 'installed'>('browse')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<PlainCategoryId | 'all'>('all')
  const [sort, setSort] = useState<'stars' | 'recent' | 'added' | 'name'>('stars')
  const [armed, setArmed] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [showExplain, setShowExplain] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const refreshInstalled = useCallback(() => request<InstalledResponse>('/dsh-plugin-menu/installed').then(value => {
    cachedInstalled = value
    setInstalled(value)
  }), [])

  const refresh = useCallback((force = false) => {
    setLoading(true)
    setError(null)
    return Promise.all([
      request<CatalogResponse>(`/dsh-plugin-menu/catalog${force ? '?refresh=1' : ''}`),
      request<InstalledResponse>('/dsh-plugin-menu/installed'),
    ]).then(([nextCatalog, nextInstalled]) => {
      cachedCatalog = nextCatalog
      cachedInstalled = nextInstalled
      setCatalog(nextCatalog)
      setInstalled(nextInstalled)
    }).catch(reason => {
      setError(reason instanceof Error ? reason.message : t('loadFailed'))
    }).finally(() => setLoading(false))
  }, [t])

  useEffect(() => {
    if (!open) return
    void refresh(false)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') store.setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    window.setTimeout(() => searchRef.current?.focus(), 0)
    return () => {
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open, refresh, store])

  const dependencies = installed?.dependencies ?? []
  const counts = useMemo(() => {
    const map = new Map<PlainCategoryId, number>()
    for (const plugin of catalog?.plugins ?? []) map.set(plugin.category, (map.get(plugin.category) ?? 0) + 1)
    return map
  }, [catalog])
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    const rows = (catalog?.plugins ?? []).filter(plugin => {
      if (category !== 'all' && plugin.category !== category) return false
      if (normalized === '') return true
      return [plugin.name, plugin.owner, plugin.repo, plugin.description.zh, plugin.description.en, ...plugin.topics]
        .some(value => value.toLocaleLowerCase().includes(normalized))
    })
    return [...rows].sort((a, b) => {
      if (sort === 'stars') return b.stars - a.stars
      if (sort === 'recent') return Date.parse(b.maintenanceAt ?? '1970-01-01') - Date.parse(a.maintenanceAt ?? '1970-01-01')
      if (sort === 'added') return Date.parse(b.addedAt ?? '1970-01-01') - Date.parse(a.addedAt ?? '1970-01-01')
      return a.name.localeCompare(b.name)
    })
  }, [catalog, category, query, sort])

  const install = (plugin: CatalogPlugin): void => {
    setBusy(plugin.id)
    setError(null)
    void mutate<OperationResponse>('/dsh-plugin-menu/install', { id: plugin.id }).then(result => {
      setNotice(result.message)
      setArmed(null)
      return refreshInstalled()
    }).catch(reason => setError(reason instanceof Error ? reason.message : t('operationFailed')))
      .finally(() => setBusy(null))
  }
  const remove = (dependency: InstalledDependency): void => {
    setBusy(dependency.name)
    setError(null)
    void mutate<OperationResponse>('/dsh-plugin-menu/remove', { packageName: dependency.name }).then(result => {
      setNotice(result.message)
      setArmed(null)
      return refreshInstalled()
    }).catch(reason => setError(reason instanceof Error ? reason.message : t('operationFailed')))
      .finally(() => setBusy(null))
  }

  if (!open) return null
  const sourceLabel = catalog === null ? '' : t(`source${catalog.source[0]!.toUpperCase()}${catalog.source.slice(1)}`)
  return (
    <div className={css.backdrop} role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) store.setOpen(false)
    }}>
      <section className={css.menu} role="dialog" aria-modal="true" aria-labelledby="plugin-menu-title">
        <header className={css.header}>
          <div className={css.brandIcon}>{menuIcon()}</div>
          <div className={css.heading}>
            <h1 id="plugin-menu-title">{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </div>
          <div className={css.headerStats}>
            <span>{catalog?.plugins.length ?? 0} plugins</span>
            <span>{sourceLabel}</span>
          </div>
          <button className={css.close} type="button" aria-label={t('close')} onClick={() => store.setOpen(false)}>×</button>
        </header>
        <div className={css.tabs}>
          <button type="button" data-active={tab === 'browse'} onClick={() => setTab('browse')}>{t('browse')}</button>
          <button type="button" data-active={tab === 'installed'} onClick={() => setTab('installed')}>
            {t('installed')}<span>{dependencies.length}</span>
          </button>
          <div className={css.tabsSpacer} />
          <button type="button" className={css.explainButton} onClick={() => setShowExplain(value => !value)}>ⓘ {t('explain')}</button>
        </div>
        {showExplain ? (
          <aside className={css.explainer}>
            <p>{t('categoryNote')}</p><p>{t('metricNote')}</p><p>{t('safetyNote')}</p>
          </aside>
        ) : null}
        {notice !== null ? <div className={css.notice}>✓ {notice}<button type="button" onClick={() => setNotice(null)}>×</button></div> : null}
        {error !== null ? <div className={css.error} role="alert">{t('operationFailed')}: {error}<button type="button" onClick={() => setError(null)}>×</button></div> : null}
        {tab === 'browse' ? (
          <div className={css.content}>
            <nav className={css.categories} aria-label="Plugin categories">
              <button type="button" data-active={category === 'all'} onClick={() => setCategory('all')}>
                <b>▦</b><span>{t('all')}</span><em>{catalog?.plugins.length ?? 0}</em>
              </button>
              {CATEGORIES.map(item => (
                <button key={item.id} type="button" data-active={category === item.id} onClick={() => setCategory(item.id)}>
                  <b>{item.icon}</b><span>{language === 'zh' ? item.zh : item.en}</span><em>{counts.get(item.id) ?? 0}</em>
                </button>
              ))}
            </nav>
            <main className={css.main}>
              <div className={css.toolbar}>
                <label className={css.search}>
                  <span>⌕</span>
                  <input ref={searchRef} type="search" value={query} placeholder={t('search')} onChange={event => setQuery(event.currentTarget.value)} />
                  {query !== '' ? <button type="button" onClick={() => setQuery('')}>×</button> : null}
                </label>
                <select value={sort} aria-label="Sort plugins" onChange={event => setSort(event.currentTarget.value as typeof sort)}>
                  <option value="stars">{t('sortStars')}</option>
                  <option value="recent">{t('sortRecent')}</option>
                  <option value="added">{t('sortAdded')}</option>
                  <option value="name">{t('sortName')}</option>
                </select>
                <button className={css.refresh} type="button" disabled={loading} onClick={() => { void refresh(true) }}>↻ {t('refresh')}</button>
              </div>
              {loading && catalog === null ? <p className={css.state}>{t('loading')}</p> : null}
              {!loading && catalog === null ? <p className={css.state}>{t('loadFailed')}</p> : null}
              {catalog !== null && visible.length === 0 ? <p className={css.state}>{t('empty')}</p> : null}
              <div className={css.grid} aria-busy={loading}>
                {visible.map(plugin => (
                  <PluginCard
                    key={plugin.id}
                    plugin={plugin}
                    dependency={installedMatch(plugin, dependencies)}
                    language={language}
                    t={t}
                    busy={busy === plugin.id}
                    armed={armed === plugin.id}
                    onArm={() => setArmed(value => value === plugin.id ? null : plugin.id)}
                    onInstall={() => install(plugin)}
                  />
                ))}
              </div>
            </main>
          </div>
        ) : (
          <main className={css.installedPane}>
            <div className={css.installedHeader}>
              <div><h2>{t('installed')}</h2><p>{installed?.profile ?? 'web'} profile · {dependencies.length} plugins</p></div>
              {installed?.restartRequired ? <span>↻ {t('restart')}</span> : null}
            </div>
            {dependencies.length === 0 ? <p className={css.state}>{t('dependenciesEmpty')}</p> : null}
            <div className={css.installedGrid}>
              {dependencies.map(dependency => (
                <InstalledCard
                  key={dependency.name}
                  dependency={dependency}
                  t={t}
                  armed={armed === dependency.name}
                  busy={busy === dependency.name}
                  onArm={() => setArmed(value => value === dependency.name ? null : dependency.name)}
                  onRemove={() => remove(dependency)}
                />
              ))}
            </div>
          </main>
        )}
      </section>
    </div>
  )
}
