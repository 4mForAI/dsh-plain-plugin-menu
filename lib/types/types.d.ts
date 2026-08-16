export type PlainCategoryId = 'skin' | 'research' | 'code' | 'vision' | 'memory' | 'automation' | 'messages' | 'files' | 'models' | 'safety' | 'skills' | 'chat' | 'fun' | 'plugins' | 'other';
export interface CatalogPlugin {
    id: string;
    name: string;
    owner: string;
    repo: string;
    url: string;
    description: {
        zh: string;
        en: string;
    };
    category: PlainCategoryId;
    sourceCategory: string;
    installTarget: string | null;
    npm: string | null;
    stars: number;
    forks: number | null;
    openIssues: number | null;
    maintenanceAt: string | null;
    addedAt: string | null;
    license: string | null;
    archived: boolean;
    curated: boolean;
    topics: string[];
}
export interface CatalogResponse {
    plugins: CatalogPlugin[];
    source: 'live' | 'cache' | 'snapshot';
    syncedAt: string;
    registryUpdatedAt: string | null;
}
export interface InstalledDependency {
    name: string;
    spec: string;
    version: string | null;
    active: boolean;
    bundle: boolean;
    repository: string | null;
}
export interface InstalledResponse {
    profile: string;
    dependencies: InstalledDependency[];
    restartRequired: boolean;
}
export interface OperationResponse {
    ok: boolean;
    message: string;
    packageName?: string;
    restartRequired?: boolean;
    details?: string;
}
