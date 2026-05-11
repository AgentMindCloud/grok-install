function ts() { return new Date().toISOString(); }

function fmt(level, payload) {
  return JSON.stringify({ ts: ts(), level, ...payload });
}

export function logInfo(payload) {
  try { console.log(fmt('info', payload)); } catch { /* swallow */ }
}

export function logWarn(payload) {
  try { console.warn(fmt('warn', payload)); } catch { /* swallow */ }
}

export function logError(payload) {
  try { console.error(fmt('error', payload)); } catch { /* swallow */ }
}

export function requestContext(request) {
  const url = new URL(request.url);
  return {
    requestId: request.headers.get('cf-ray') || crypto.randomUUID(),
    method: request.method,
    path: url.pathname,
  };
}
