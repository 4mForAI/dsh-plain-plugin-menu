export function sendJson(response, status, value) {
    response.writeHead(status, {
        'cache-control': 'no-store',
        'content-type': 'application/json; charset=utf-8',
        'x-content-type-options': 'nosniff',
    });
    response.end(JSON.stringify(value));
}
/** Mutations must come from this DSH page, not a drive-by cross-site request. */
export function trustedMutation(request) {
    if (request.headers['x-dsh-plugin-menu'] !== '1')
        return false;
    const origin = request.headers.origin;
    const host = request.headers.host;
    if (origin === undefined || host === undefined)
        return false;
    try {
        return new URL(origin).host === host;
    }
    catch {
        return false;
    }
}
export async function readJsonBody(request, maxBytes = 4096) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        size += buffer.length;
        if (size > maxBytes)
            throw new Error('request body is too large');
        chunks.push(buffer);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export function routeMethod(request, response, method) {
    if (request.method === method)
        return true;
    response.writeHead(405, { allow: method });
    response.end();
    return false;
}
