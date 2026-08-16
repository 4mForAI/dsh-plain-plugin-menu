import { writeFile } from 'node:fs/promises'

const registryResponse = await fetch('https://awesome-dsh-plugin.com/plugins.json')
if (!registryResponse.ok) throw new Error(`registry: HTTP ${registryResponse.status}`)
const registry = await registryResponse.json()
await writeFile(new URL('../data/registry-snapshot.json', import.meta.url), `${JSON.stringify(registry)}\n`)

const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'dsh-plain-plugin-menu-snapshot/0.1.1',
  'x-github-api-version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}
const query = 'q=topic%3Adsh-plugin&sort=stars&order=desc&per_page=100'
const rows = []
for (let page = 1; page <= 10; page += 1) {
  const response = await fetch(`https://api.github.com/search/repositories?${query}&page=${page}`, { headers })
  if (!response.ok) throw new Error(`GitHub page ${page}: HTTP ${response.status}`)
  const body = await response.json()
  for (const item of body.items ?? []) {
    rows.push({
      fullName: item.full_name,
      stars: item.stargazers_count ?? 0,
      forks: item.forks_count ?? 0,
      openIssues: item.open_issues_count ?? 0,
      pushedAt: item.pushed_at ?? null,
      license: item.license?.spdx_id && item.license.spdx_id !== 'NOASSERTION' ? item.license.spdx_id : null,
      archived: item.archived === true,
      topics: Array.isArray(item.topics) ? item.topics : [],
    })
  }
  if ((body.items?.length ?? 0) < 100) break
}
await writeFile(new URL('../data/github-metrics.json', import.meta.url), `${JSON.stringify(rows)}\n`)
process.stdout.write(`snapshot: ${registry.plugins?.length ?? 0} curated plugins, ${rows.length} GitHub metrics\n`)
