const XAI_BASE = 'https://api.x.ai/v1';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function xaiFetch(env, path, body, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${XAI_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function chatRequest(env, body) {
  let res;
  try {
    res = await xaiFetch(env, '/chat/completions', body, 30000);
  } catch (e) {
    res = null;
  }
  if (!res || res.status >= 500) {
    await sleep(1000);
    try {
      res = await xaiFetch(env, '/chat/completions', body, 30000);
    } catch (e) {
      res = null;
    }
    if (!res || res.status >= 500) {
      await sleep(2000);
      res = await xaiFetch(env, '/chat/completions', body, 30000);
    }
  }
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`xAI ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

export async function chatJson(env, { systemPrompt, userPrompt, model = 'grok-4', temperature = 0.4, fallback = null }) {
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt ?? '' },
    ],
    temperature,
    response_format: { type: 'json_object' },
  };
  let json;
  try {
    json = await chatRequest(env, body);
  } catch (e) {
    if (fallback !== null) return fallback;
    throw e;
  }
  const content = json?.choices?.[0]?.message?.content ?? '';
  try {
    return JSON.parse(content);
  } catch {
    const retryBody = {
      ...body,
      messages: [
        ...body.messages,
        { role: 'assistant', content },
        { role: 'user', content: 'Return ONLY valid JSON. No preamble, no commentary.' },
      ],
    };
    try {
      const retryJson = await chatRequest(env, retryBody);
      const retryContent = retryJson?.choices?.[0]?.message?.content ?? '';
      return JSON.parse(retryContent);
    } catch {
      if (fallback !== null) return fallback;
      throw new Error('xAI returned non-JSON twice');
    }
  }
}

export async function chatText(env, { systemPrompt, userPrompt, model = 'grok-3', temperature = 0.7, maxTokens = 280 }) {
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...(userPrompt ? [{ role: 'user', content: userPrompt }] : []),
    ],
    temperature,
    max_tokens: maxTokens,
  };
  const json = await chatRequest(env, body);
  return (json?.choices?.[0]?.message?.content ?? '').trim();
}

// Like chatText, but accepts a multi-turn `messages` array prepended with the
// system prompt. Returns { text, usage } so callers can surface token counts.
export async function chatMessages(env, { systemPrompt, messages, model = 'grok-3', temperature = 0.7, maxTokens = 280 }) {
  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
    temperature,
    max_tokens: maxTokens,
  };
  const json = await chatRequest(env, body);
  return {
    text: (json?.choices?.[0]?.message?.content ?? '').trim(),
    usage: json?.usage || null,
  };
}

export async function generateImage(env, { prompt, model = 'grok-imagine-image' }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);
  try {
    const res = await fetch(`${XAI_BASE}/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, prompt, n: 1, response_format: 'url' }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`xAI image ${res.status}: ${errText.slice(0, 200)}`);
    }
    const json = await res.json();
    const url = json?.data?.[0]?.url;
    if (!url) throw new Error('xAI image: no URL returned');
    return { url };
  } finally {
    clearTimeout(timer);
  }
}
