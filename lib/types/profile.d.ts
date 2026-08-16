import type { InstalledResponse, OperationResponse } from './types.js';
export interface LoaderEntryLike {
    options: {
        name?: string;
    };
    fiber?: unknown;
}
export interface LoaderLike {
    entries(): Iterable<LoaderEntryLike>;
}
export declare function profileDirectory(profile: string): string;
export declare function installedPlugins(profile: string, loader: LoaderLike, restartRequired: boolean): InstalledResponse;
export declare class ProfileManager {
    readonly profile: string;
    private readonly loader;
    private readonly timeoutMs;
    private busy;
    private changed;
    constructor(profile: string, loader: LoaderLike, timeoutMs: number);
    list(): InstalledResponse;
    install(target: string): Promise<OperationResponse>;
    remove(name: string): Promise<OperationResponse>;
    private run;
}
