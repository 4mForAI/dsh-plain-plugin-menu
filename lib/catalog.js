import { readFileSync } from 'node:fs';
const REGISTRY_URL = 'https://awesome-dsh-plugin.com/plugins.json';
const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories';
const NPM_NAME_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const RULES = [
    { id: 'safety', words: /security|secure|safety|sandbox|permission|guard|audit|secret|policy|安全|沙箱|权限|审计|防护|密钥/i },
    { id: 'vision', words: /vision|image|picture|photo|ocr|screenshot|design|canvas|draw|video|figma|看图|图片|图像|视觉|截图|设计|绘图|视频/i },
    { id: 'research', words: /search|research|browser|crawl|fetch|web|paper|scholar|news|reference|citation|资料|搜索|检索|浏览器|论文|新闻|网页|查找/i },
    { id: 'files', words: /file|filesystem|storage|drive|document|pdf|excel|sheet|archive|folder|文件|目录|存储|文档|表格|网盘|压缩/i },
    { id: 'code', words: /code|coding|developer|git|github|terminal|shell|lsp|debug|test|review|diff|runtime|编程|代码|开发|终端|调试|测试|审查/i },
    { id: 'memory', words: /memory|remember|knowledge.?graph|recall|记忆|知识图谱|回忆|长期记住/i },
    { id: 'automation', words: /workflow|automation|schedule|cron|agent.?team|subagent|orchestrat|background|自动|工作流|定时|子代理|多代理|编排/i },
    { id: 'messages', words: /notify|notification|wechat|slack|discord|email|telegram|webhook|message|通知|微信|邮件|消息|飞书|钉钉/i },
    { id: 'models', words: /model|provider|llm|api.?key|openrouter|ollama|deepseek|模型|供应商|推理|算力/i },
    { id: 'plugins', words: /plugin.?market|marketplace|plugin.?manager|plugin.?finder|插件市场|插件管理|插件搜索/i },
    { id: 'skin', words: /theme|skin|sidebar|ui|appearance|layout|wallpaper|avatar|pet|主题|皮肤|侧边栏|界面|外观|壁纸|桌宠/i },
    { id: 'skills', words: /skill|prompt|instruction|技能|提示词|指令包/i },
    { id: 'chat', words: /session|conversation|chat|composer|context|message|会话|聊天|上下文|输入框/i },
    { id: 'fun', words: /fun|game|joke|ads|music|toy|whale|娱乐|游戏|玩具|广告|音乐|鲸鱼/i },
];
const SOURCE_CATEGORY_FALLBACK = {
    ui: 'skin',
    theme: 'skin',
    model: 'models',
    session: 'chat',
    memory: 'memory',
    skill: 'skills',
    workflow: 'automation',
    notify: 'messages',
    dev: 'code',
    market: 'plugins',
    fun: 'fun',
};
/** Public and deterministic so category changes can be tested and reviewed. */
export function classifyPlugin(sourceCategory, text) {
    for (const rule of RULES)
        if (rule.words.test(text))
            return rule.id;
    return SOURCE_CATEGORY_FALLBACK[sourceCategory] ?? (sourceCategory === 'tools' ? 'skills' : 'other');
}
function object(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
        ? value
        : null;
}
function string(value) {
    return typeof value === 'string' && value.trim() !== '' ? value.trim() : null;
}
function number(value, fallback = 0) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
export function parseGithubSource(url) {
    const match = /^https:\/\/github\.com\/([^/]+\/[^/]+?)(?:\/tree\/[^/]+\/(.+?))?\/?$/.exec(url);
    if (match?.[1] === undefined || !REPO_RE.test(match[1]))
        return null;
    const subpath = match[2] ?? null;
    if (subpath !== null && (!/^[A-Za-z0-9_./-]+$/.test(subpath)
        || subpath.split('/').some(part => part === '' || part === '.' || part === '..')))
        return null;
    return { repo: match[1], subpath };
}
export function installTarget(plugin) {
    const npm = string(plugin.npm);
    if (npm !== null && NPM_NAME_RE.test(npm))
        return npm;
    const sourceUrl = string(plugin.url);
    if (sourceUrl === null)
        return null;
    const source = parseGithubSource(sourceUrl);
    if (source === null)
        return null;
    return source.subpath === null
        ? `github:${source.repo}`
        : `github:${source.repo}#path:/${source.subpath}`;
}
function readJson(relative, fallback) {
    try {
        return JSON.parse(readFileSync(new URL(relative, import.meta.url), 'utf8'));
    }
    catch {
        return fallback;
    }
}
function snapshotRegistry() {
    return readJson('../data/registry-snapshot.json', { plugins: [] });
}
function snapshotGithub() {
    const rows = readJson('../data/github-metrics.json', []);
    return new Map(rows.map(row => [row.fullName.toLocaleLowerCase(), row]));
}
function githubMetric(item) {
    const fullName = string(item.full_name);
    if (fullName === null || !REPO_RE.test(fullName))
        return null;
    const topics = Array.isArray(item.topics)
        ? item.topics.filter((topic) => typeof topic === 'string')
        : [];
    const license = item.license === null ? null : string(item.license?.spdx_id);
    return {
        fullName,
        stars: number(item.stargazers_count),
        forks: number(item.forks_count),
        openIssues: number(item.open_issues_count),
        pushedAt: string(item.pushed_at),
        license: license === 'NOASSERTION' ? null : license,
        archived: item.archived === true,
        topics,
    };
}
function normalizeRegistry(value) {
    const root = object(value);
    if (root === null || !Array.isArray(root.plugins) || root.plugins.length === 0) {
        throw new Error('plugin registry is empty or malformed');
    }
    return { updated: root.updated, plugins: root.plugins };
}
function catalogFrom(registry, github) {
    const rows = Array.isArray(registry.plugins) ? registry.plugins : [];
    const result = [];
    for (const raw of rows) {
        const name = string(raw.name);
        const url = string(raw.url);
        if (name === null || url === null)
            continue;
        const source = parseGithubSource(url);
        if (source === null)
            continue;
        const descriptions = object(raw.description);
        const zh = string(descriptions?.zh) ?? string(descriptions?.en) ?? '暂无介绍';
        const en = string(descriptions?.en) ?? zh;
        const sourceCategory = string(raw.category) ?? 'other';
        const metric = github.get(source.repo.toLocaleLowerCase());
        const topics = metric?.topics ?? [];
        const searchable = [name, zh, en, source.repo, sourceCategory, ...topics].join(' ');
        result.push({
            id: `${source.repo}${source.subpath === null ? '' : `#${source.subpath}`}|${name}`.toLocaleLowerCase(),
            name,
            owner: string(raw.owner) ?? source.repo.split('/')[0] ?? '',
            repo: source.repo,
            url,
            description: { zh, en },
            category: classifyPlugin(sourceCategory, searchable),
            sourceCategory,
            installTarget: installTarget(raw),
            npm: string(raw.npm),
            stars: metric?.stars ?? number(raw.stars),
            forks: metric?.forks ?? null,
            openIssues: metric?.openIssues ?? null,
            maintenanceAt: metric?.pushedAt ?? null,
            addedAt: string(raw.added),
            license: metric?.license ?? null,
            archived: metric?.archived ?? false,
            curated: true,
            topics,
        });
    }
    return result;
}
async function fetchJson(url, headers = {}) {
    const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok)
        throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
}
async function fetchRegistry() {
    return normalizeRegistry(await fetchJson(REGISTRY_URL));
}
async function fetchGithub(pages) {
    const headers = {
        accept: 'application/vnd.github+json',
        'user-agent': 'dsh-plain-plugin-menu/0.1.1',
        'x-github-api-version': '2022-11-28',
    };
    const token = process.env.GITHUB_TOKEN?.trim();
    if (token !== undefined && token !== '')
        headers.authorization = `Bearer ${token}`;
    const query = 'q=topic%3Adsh-plugin&sort=stars&order=desc&per_page=100';
    const first = object(await fetchJson(`${GITHUB_SEARCH_URL}?${query}&page=1`, headers));
    const firstItems = Array.isArray(first?.items) ? first.items : [];
    const total = number(first?.total_count);
    const pageCount = Math.max(1, Math.min(pages, 10, Math.ceil(total / 100)));
    const remaining = await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) => fetchJson(`${GITHUB_SEARCH_URL}?${query}&page=${index + 2}`, headers)
        .then(value => object(value))
        .then(value => Array.isArray(value?.items) ? value.items : [])
        .catch(() => [])));
    const metrics = new Map();
    for (const item of [...firstItems, ...remaining.flat()]) {
        const metric = githubMetric(item);
        if (metric !== null)
            metrics.set(metric.fullName.toLocaleLowerCase(), metric);
    }
    if (metrics.size === 0)
        throw new Error('GitHub topic search returned no repositories');
    return metrics;
}
export class CatalogService {
    options;
    registry = snapshotRegistry();
    github = snapshotGithub();
    cached;
    refreshPromise = null;
    refreshedAt = 0;
    constructor(options) {
        this.options = options;
        this.cached = this.compose('snapshot');
    }
    compose(source) {
        return {
            plugins: catalogFrom(this.registry, this.github),
            source,
            syncedAt: new Date().toISOString(),
            registryUpdatedAt: string(this.registry.updated),
        };
    }
    async list(force = false) {
        if (!force && this.refreshedAt > 0 && Date.now() - this.refreshedAt < this.options.ttlMs) {
            return { ...this.cached, source: 'cache' };
        }
        if (this.refreshPromise !== null)
            return this.refreshPromise;
        this.refreshPromise = this.refresh().finally(() => { this.refreshPromise = null; });
        return this.refreshPromise;
    }
    find(id) {
        return this.cached.plugins.find(plugin => plugin.id === id);
    }
    async refresh() {
        const [registry, github] = await Promise.allSettled([
            fetchRegistry(),
            fetchGithub(this.options.githubPages),
        ]);
        if (registry.status === 'fulfilled')
            this.registry = registry.value;
        if (github.status === 'fulfilled') {
            // A GitHub search page can be rate-limited independently. Keep bundled
            // metrics for repositories absent from a partial live response, while
            // allowing every live row to replace its older snapshot.
            this.github = new Map([...this.github, ...github.value]);
        }
        if (registry.status === 'rejected' && github.status === 'rejected')
            return this.cached;
        this.refreshedAt = Date.now();
        this.cached = this.compose('live');
        return this.cached;
    }
}
