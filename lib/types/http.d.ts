import type { IncomingMessage, ServerResponse } from 'node:http';
export declare function sendJson(response: ServerResponse, status: number, value: unknown): void;
/** Mutations must come from this DSH page, not a drive-by cross-site request. */
export declare function trustedMutation(request: IncomingMessage): boolean;
export declare function readJsonBody(request: IncomingMessage, maxBytes?: number): Promise<unknown>;
export declare function routeMethod(request: IncomingMessage, response: ServerResponse, method: 'GET' | 'POST'): boolean;
