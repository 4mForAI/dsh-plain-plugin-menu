import type { Context } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
export declare const name = "plain-plugin-menu";
export declare const inject: string[];
export interface Config {
    profile: string;
    catalogTtlMinutes: number;
    githubPages: number;
    operationTimeoutMinutes: number;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): void;
