import { describe, expect, it } from 'vitest'
import { classifyPlugin, installTarget, parseGithubSource } from '../src/catalog.js'

describe('plain-language catalog rules', () => {
  it('puts security signals ahead of generic developer words', () => {
    expect(classifyPlugin('dev', 'security audit for coding agents')).toBe('safety')
  })

  it('recognizes the requested novice-friendly buckets', () => {
    expect(classifyPlugin('theme', 'dark theme')).toBe('skin')
    expect(classifyPlugin('tools', 'web research and search')).toBe('research')
    expect(classifyPlugin('dev', 'git code review')).toBe('code')
    expect(classifyPlugin('workflow', 'scheduled automation')).toBe('automation')
  })

  it('parses root and monorepo GitHub sources without path traversal', () => {
    expect(parseGithubSource('https://github.com/acme/plugin')).toEqual({ repo: 'acme/plugin', subpath: null })
    expect(parseGithubSource('https://github.com/acme/plugins/tree/main/packages/a')).toEqual({ repo: 'acme/plugins', subpath: 'packages/a' })
    expect(parseGithubSource('https://github.com/acme/plugins/tree/main/../escape')).toBeNull()
  })

  it('prefers verified npm names and builds safe GitHub targets', () => {
    expect(installTarget({ npm: 'dsh-demo', url: 'https://github.com/acme/demo' })).toBe('dsh-demo')
    expect(installTarget({ npm: 'bad name', url: 'https://github.com/acme/demo' })).toBe('github:acme/demo')
  })
})
