export function profileAnalyzerPrompt(handle) {
  return `You are a profile analysis tool. You will be given an X (formerly Twitter) handle and a sample of that user's recent original posts (retweets and replies excluded). Analyze only the supplied posts. Return a structured personality profile.

OUTPUT FORMAT — return ONLY valid JSON, no preamble, no commentary, this exact shape:

{
  "voice_traits": [array of 3-5 lowercase single-word adjectives describing how they write],
  "domains": [array of 2-5 short topic phrases describing what they post about],
  "vibe": [array of 2-3 lowercase single-word tone descriptors],
  "signature_phrases": [array of 2-4 short phrases (2-8 words each) that the person actually uses]
}

RULES:
- Every trait must be evidence-based, drawn from the supplied posts only.
- voice_traits = HOW they write. domains = WHAT they write about. vibe = overall TONE.
- signature_phrases must be verbatim excerpts from the supplied posts. Never invent.
- If fewer than 5 posts are supplied, return safe neutral defaults at minimum array lengths.
- Never reference protected characteristics (race, religion, sexuality, nationality).
- Be respectful and accurate. No projection. No stereotyping.

Handle: @${handle}

Return JSON only.`;
}

export function buildProfileUserPrompt(handle, posts) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return `Handle: @${handle}\n\nNo recent posts are available. Return safe neutral defaults at minimum array lengths.`;
  }
  const lines = posts
    .map((p) => (typeof p?.text === 'string' ? p.text.replace(/\s+/g, ' ').trim() : ''))
    .filter((t) => t.length > 0)
    .map((t, i) => `${i + 1}. ${t}`);
  if (lines.length === 0) {
    return `Handle: @${handle}\n\nNo recent posts are available. Return safe neutral defaults at minimum array lengths.`;
  }
  return `Handle: @${handle}\n\nRecent original posts (${lines.length}):\n${lines.join('\n')}\n\nAnalyze these posts and return the JSON profile.`;
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
