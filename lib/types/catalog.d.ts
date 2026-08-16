import type { CatalogPlugin, CatalogResponse, PlainCategoryId } from './types.js';
interface RegistryPlugin {
    name?: unknown;
    owner?: unknown;
    url?: unknown;
    category?: unknown;
    description?: unknown;
    npm?: unknown;
    stars?: unknown;
    install?: unknown;
    added?: unknown;
}
/** Public and deterministic so category changes can be tested and reviewed. */
export declare function classifyPlugin(sourceCategory: string, text: string): PlainCategoryId;
export declare function parseGithubSource(url: string): {
    repo: string;
    subpath: string | null;
} | null;
export declare function installTarget(plugin: RegistryPlugin): string | null;
export interface CatalogOptions {
    ttlMs: number;
    githubPages: number;
}
export declare class CatalogService {
    private readonly options;
    private registry;
    private github;
    private cached;
    private refreshPromise;
    private refreshedAt;
    constructor(options: CatalogOptions);
    private compose;
    list(force?: boolean): Promise<CatalogResponse>;
    find(id: string): CatalogPlugin | undefined;
    private refresh;
}
export {};
