export function profileAnalyzerPrompt(handle) {
  return `You are a profile analysis tool. The user message contains an X user's most recent original posts as JSON. Analyze ONLY what is in those posts to produce a structured personality profile.

OUTPUT FORMAT — return ONLY valid JSON, no preamble, no commentary, this exact shape:

{
  "voice_traits": [array of 3-5 lowercase single-word adjectives describing how they write],
  "domains": [array of 2-5 short topic phrases describing what they post about],
  "vibe": [array of 2-3 lowercase single-word tone descriptors],
  "signature_phrases": [array of 2-4 short phrases (2-8 words each) that the person actually used in the provided posts]
}

RULES:
- Every trait must be evidence-based, drawn ONLY from the provided post texts.
- voice_traits = HOW they write. domains = WHAT they write about. vibe = overall TONE.
- signature_phrases must be verbatim excerpts from the provided posts. Never invent.
- If fewer than 10 posts are provided, lean toward conservative neutral descriptors.
- Never reference protected characteristics (race, religion, sexuality, nationality).
- Be respectful and accurate. No projection. No stereotyping.

Handle being analyzed: @${handle}

Return JSON only.`;
}

// Build the user-message body that carries the actual posts into the
// analyzer call. Filters obvious noise, truncates each post to keep the
// prompt under Grok's practical context budget, and caps the array at 50.
// Returns a plain string suitable for `chatJson({ userPrompt })`.
export function buildAnalyzerUserPrompt(handle, posts) {
  const trimmed = (Array.isArray(posts) ? posts : [])
    .filter(p => p && typeof p.text === 'string' && p.text.trim().length > 5)
    .slice(0, 50)
    .map(p => ({
      text: p.text.length > 280 ? p.text.slice(0, 280) + '…' : p.text,
      created_at: p.created_at || null,
      likes: p.public_metrics?.like_count ?? 0,
      replies: p.public_metrics?.reply_count ?? 0,
      retweets: p.public_metrics?.retweet_count ?? 0,
      lang: p.lang || null,
    }));
  if (trimmed.length === 0) {
    return `Analyze @${handle}. No public posts were available to read; return safe neutral defaults at minimum array lengths.`;
  }
  return `Analyze @${handle}. Here are their ${trimmed.length} most recent original posts (excluding retweets and replies) as JSON:\n\n` +
    JSON.stringify(trimmed, null, 2) +
    `\n\nReturn ONLY the JSON personality profile described in the system prompt.`;
}

export function sampleReplyPrompt(handle, profile) {
  const voice = (profile.voice_traits || []).join(', ');
  const domains = (profile.domains || []).join(', ');
  const vibe = (profile.vibe || []).join(', ');
  const signatures = JSON.stringify(profile.signature_phrases || []);
  return `You are roleplaying as an X agent that replies in the voice of @${handle}. Their personality profile is:

Voice: ${voice}
Domains: ${domains}
Vibe: ${vibe}
Signature phrases (occasionally use, naturally): ${signatures}

REPLY RULES:
- Reply to the question below as @${handle} would.
- Stay under 280 characters.
- Match their typical post length.
- Do NOT announce that you are an AI.
- Do NOT start with "Great question" or any filler opener.
- Be authentic to the voice, not a caricature.

QUESTION: "What did you build today?"

Return ONLY the reply text.`;
}

export function safeProfileDefaults() {
  return {
    voice_traits: ['direct', 'helpful', 'curious'],
    domains: ['tech', 'community'],
    vibe: ['friendly', 'thoughtful'],
    signature_phrases: [],
  };
}

export function safeSampleReply(handle) {
  return `Building something small today. Mostly debugging. /${handle}`;
}
