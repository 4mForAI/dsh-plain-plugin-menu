import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, isAbsolute, join, resolve } from 'node:path'
import type { InstalledDependency, InstalledResponse, OperationResponse } from './types.js'

interface ProfileManifest {
  dependencies?: Record<string, string>
  dsh?: { profile?: { bundles?: string[] } }
}

interface PackageManifest {
  version?: unknown
  repository?: unknown
  dsh?: { bundle?: unknown }
}

export interface LoaderEntryLike {
  options: { name?: string }
  fiber?: unknown
}

export interface LoaderLike {
  entries(): Iterable<LoaderEntryLike>
}

const PROFILE_RE = /^[A-Za-z0-9_-]+$/
const INSTALL_TARGET_RE = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$|^github:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:#path:\/[A-Za-z0-9_./-]+)?$/

function dshHome(): string {
  const configured = process.env.DSH_HOME?.trim()
  return resolve(configured === undefined || configured === '' ? join(homedir(), '.dsh') : configured)
}

export function profileDirectory(profile: string): string {
  if (!PROFILE_RE.test(profile)) throw new Error(`invalid DSH profile name: ${profile}`)
  return join(dshHome(), 'profiles', profile)
}

function readJson<T>(path: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  } catch {
    return fallback
  }
}

function readProfile(profile: string): ProfileManifest {
  return readJson(join(profileDirectory(profile), 'package.json'), {})
}

function packageDirectory(profileDir: string, name: string): string {
  return join(profileDir, 'node_modules', ...name.split('/'))
}

function repositoryUrl(value: unknown): string | null {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    const url = (value as { url?: unknown }).url
    return typeof url === 'string' ? url : null
  }
  return null
}

export function installedPlugins(profile: string, loader: LoaderLike, restartRequired: boolean): InstalledResponse {
  const manifest = readProfile(profile)
  const active = new Set<string>()
  for (const entry of loader.entries()) {
    if (entry.fiber !== undefined && typeof entry.options.name === 'string') active.add(entry.options.name)
  }
  const dependencies: InstalledDependency[] = []
  for (const [name, spec] of Object.entries(manifest.dependencies ?? {})) {
    const packageManifest = readJson<PackageManifest>(join(packageDirectory(profileDirectory(profile), name), 'package.json'), {})
    dependencies.push({
      name,
      spec,
      version: typeof packageManifest.version === 'string' ? packageManifest.version : null,
      active: active.has(name),
      bundle: packageManifest.dsh?.bundle !== undefined,
      repository: repositoryUrl(packageManifest.repository),
    })
  }
  dependencies.sort((a, b) => a.name.localeCompare(b.name))
  return { profile, dependencies, restartRequired }
}

interface SpawnSpec {
  file: string
  args: string[]
  cwd: string | undefined
}

function dshSpawnSpec(): SpawnSpec {
  const entry = process.argv[1]
  if (entry !== undefined && /[\\/](?:bin\.(?:js|ts)|dsh)$/.test(entry)) {
    const absolute = resolve(entry)
    return {
      file: process.execPath,
      args: [...process.execArgv, absolute],
      cwd: dirname(absolute),
    }
  }
  return { file: 'dsh', args: [], cwd: undefined }
}

function operationEnv(): NodeJS.ProcessEnv {
  if (process.platform === 'win32') return { ...process.env, CI: 'true' }
  const parts = (process.env.PATH ?? '').split(':').filter(Boolean)
  for (const candidate of ['/opt/homebrew/bin', '/usr/local/bin', join(homedir(), '.local', 'bin')]) {
    if (!parts.includes(candidate)) parts.push(candidate)
  }
  return { ...process.env, CI: 'true', PATH: parts.join(':') }
}

function clipOutput(value: string): string {
  const clean = value.replaceAll(dshHome(), '$DSH_HOME')
  return clean.length > 3000 ? clean.slice(-3000) : clean
}

interface CommandResult {
  exitCode: number | null
  timedOut: boolean
  stdout: string
  stderr: string
}

function runCommand(profile: string, args: string[], timeoutMs: number): Promise<CommandResult> {
  const launch = dshSpawnSpec()
  return new Promise((resolvePromise) => {
    const child = spawn(launch.file, [...launch.args, 'plugin', '--profile', profile, ...args], {
      cwd: launch.cwd,
      detached: process.platform !== 'win32',
      env: operationEnv(),
      shell: process.platform === 'win32' && launch.file === 'dsh',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    child.stdout?.on('data', (chunk: Buffer) => { stdout += chunk.toString(); if (stdout.length > 200_000) stdout = stdout.slice(-200_000) })
    child.stderr?.on('data', (chunk: Buffer) => { stderr += chunk.toString(); if (stderr.length > 200_000) stderr = stderr.slice(-200_000) })
    const timer = setTimeout(() => {
      timedOut = true
      if (process.platform !== 'win32' && child.pid !== undefined) {
        try { process.kill(-child.pid, 'SIGTERM') } catch { child.kill('SIGTERM') }
      } else child.kill('SIGTERM')
    }, timeoutMs)
    timer.unref?.()
    child.once('error', (error) => {
      clearTimeout(timer)
      resolvePromise({ exitCode: null, timedOut, stdout, stderr: `${stderr}\n${error.message}` })
    })
    child.once('close', (exitCode) => {
      clearTimeout(timer)
      resolvePromise({ exitCode, timedOut, stdout, stderr })
    })
  })
}

export class ProfileManager {
  private busy = false
  private changed = false

  constructor(
    readonly profile: string,
    private readonly loader: LoaderLike,
    private readonly timeoutMs: number,
  ) {
    profileDirectory(profile)
  }

  list(): InstalledResponse {
    return installedPlugins(this.profile, this.loader, this.changed)
  }

  async install(target: string): Promise<OperationResponse> {
    if (!INSTALL_TARGET_RE.test(target) || target.includes('..')) {
      return { ok: false, message: '安装来源不在允许范围内。' }
    }
    return this.run(['add', target], '安装', () => {
      const dependencies = this.list().dependencies
      const exact = dependencies.find(item => item.name === target)
      return exact?.name ?? dependencies.at(-1)?.name
    })
  }

  async remove(name: string): Promise<OperationResponse> {
    const installed = this.list().dependencies.some(item => item.name === name)
    if (!installed) return { ok: false, message: '这个依赖不在当前 profile 中，未执行卸载。' }
    return this.run(['remove', name], '卸载', () => name)
  }

  private async run(
    args: string[],
    verb: string,
    packageName: () => string | undefined,
  ): Promise<OperationResponse> {
    if (this.busy) return { ok: false, message: '另一个插件操作正在进行，请稍后再试。' }
    this.busy = true
    const before = new Set(this.list().dependencies.map(item => item.name))
    try {
      const result = await runCommand(this.profile, args, this.timeoutMs)
      if (result.exitCode !== 0 || result.timedOut) {
        const reason = result.timedOut ? `${verb}超时。` : `${verb}失败（退出码 ${String(result.exitCode)}）。`
        return { ok: false, message: reason, details: clipOutput(result.stderr || result.stdout) }
      }
      this.changed = true
      const after = this.list().dependencies.map(item => item.name)
      const added = after.find(name => !before.has(name))
      return {
        ok: true,
        message: `${verb}完成；重启 DSH 后完全生效。`,
        packageName: added ?? packageName(),
        restartRequired: true,
      }
    } finally {
      this.busy = false
    }
  }
}
