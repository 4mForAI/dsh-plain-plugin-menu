import { createElement as h } from 'react'
import { en, zh } from './locales.ts'
import { menuStore } from './menu-store.ts'
import { PluginMenu, PluginMenuTrigger } from './PluginMenu.tsx'

const NS = 'plain-plugin-menu'

interface LocaleLike {
  register(namespace: string, dictionaries: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): (key: string) => string
  subscribe(listener: () => void): () => void
  getSnapshot(): { active: string }
}

interface SlotsLike {
  inject(name: string, callback: () => unknown): void
  register(options: Record<string, unknown>, component: (props: Record<string, unknown>) => unknown): unknown
}

interface ClientContextLike {
  effect(callback: () => unknown, label?: string): void
  locale: LocaleLike
  slots: SlotsLike
}

export const name = 'plain-plugin-menu'
export const inject = ['slots', 'locale']

export function apply(ctx: ClientContextLike): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'plain-plugin-menu: dictionaries')
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'plain-plugin-menu',
    order: 30,
    locale: NS,
  }, (props) => h(PluginMenuTrigger, { wide: props.wide === true, t })))
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'plain-plugin-menu-overlay',
    order: 30,
    locale: NS,
  }, () => h(PluginMenu, { t, locale: ctx.locale, store: menuStore })))
}
