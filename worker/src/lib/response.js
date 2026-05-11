const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Session-Id',
  'Access-Control-Expose-Headers': 'Retry-After',
  'Access-Control-Max-Age': '86400',
};

export function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function text(body, init = {}) {
  return new Response(body, {
    status: init.status ?? 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function html(body, init = {}) {
  return new Response(body, {
    status: init.status ?? 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export function redirect(location, status = 302) {
  return new Response(null, {
    status,
    headers: { Location: location, ...CORS_HEADERS },
  });
}

export function error(message, status = 400, extra = {}, headers = {}) {
  return json({ error: message, ...extra }, { status, headers });
}

export function preflight() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function attachment(body, filename, contentType) {
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      ...CORS_HEADERS,
    },
  });
}
