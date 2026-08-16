import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { CatalogService } from './catalog.js'
import { readJsonBody, routeMethod, sendJson, trustedMutation } from './http.js'
import { ProfileManager, type LoaderLike } from './profile.js'
import type { OperationResponse } from './types.js'

export const name = 'plain-plugin-menu'
export const inject = ['webServer', 'loader']

export interface Config {
  profile: string
  catalogTtlMinutes: number
  githubPages: number
  operationTimeoutMinutes: number
}

export const Config: Schema<Config> = Schema.object({
  profile: Schema.string().default('web'),
  catalogTtlMinutes: Schema.number().min(1).max(1440).default(15),
  githubPages: Schema.number().min(1).max(10).default(10),
  operationTimeoutMinutes: Schema.number().min(1).max(60).default(15),
})

interface WebServerLike {
  register(route: {
    kind: 'exact'
    path: string
    handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>
  }): () => void
}

interface HostContext extends Context {
  webServer: WebServerLike
  loader: LoaderLike
}

function bodyObject(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

function mutationGuard(request: IncomingMessage, response: ServerResponse): boolean {
  if (trustedMutation(request)) return true
  sendJson(response, 403, { ok: false, message: '请求来源校验失败。' })
  return false
}

export function apply(ctx: Context, config: Config): void {
  const host = ctx as HostContext
  const catalog = new CatalogService({
    ttlMs: config.catalogTtlMinutes * 60_000,
    githubPages: config.githubPages,
  })
  const manager = new ProfileManager(config.profile, host.loader, config.operationTimeoutMinutes * 60_000)
  const routes: Array<{ path: string; handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void> }> = [
    {
      path: '/dsh-plugin-menu/catalog',
      handler: async (request, response) => {
        if (!routeMethod(request, response, 'GET')) return
        const force = new URL(request.url ?? '/', 'http://dsh').searchParams.get('refresh') === '1'
        sendJson(response, 200, await catalog.list(force))
      },
    },
    {
      path: '/dsh-plugin-menu/installed',
      handler: (request, response) => {
        if (!routeMethod(request, response, 'GET')) return
        sendJson(response, 200, manager.list())
      },
    },
    {
      path: '/dsh-plugin-menu/install',
      handler: async (request, response) => {
        if (!routeMethod(request, response, 'POST') || !mutationGuard(request, response)) return
        const body = bodyObject(await readJsonBody(request))
        const id = typeof body?.id === 'string' ? body.id : ''
        const plugin = catalog.find(id)
        let result: OperationResponse
        if (plugin?.installTarget === undefined || plugin.installTarget === null) {
          result = { ok: false, message: '这个条目没有经过目录验证的安装来源。' }
        } else if (plugin.archived) {
          result = { ok: false, message: '仓库已经归档，插件菜单不会直接安装它。' }
        } else {
          result = await manager.install(plugin.installTarget)
        }
        sendJson(response, result.ok ? 200 : 400, result)
      },
    },
    {
      path: '/dsh-plugin-menu/remove',
      handler: async (request, response) => {
        if (!routeMethod(request, response, 'POST') || !mutationGuard(request, response)) return
        const body = bodyObject(await readJsonBody(request))
        const packageName = typeof body?.packageName === 'string' ? body.packageName : ''
        const result = await manager.remove(packageName)
        sendJson(response, result.ok ? 200 : 400, result)
      },
    },
  ]
  ctx.effect(() => {
    const disposers = routes.map(route => host.webServer.register({ kind: 'exact', ...route }))
    return () => { for (const dispose of disposers.reverse()) dispose() }
  }, 'plain-plugin-menu: HTTP routes')
}
