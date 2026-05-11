const MASCOT_TEMPLATES = {
  cyberpunk_neon: 'Cyberpunk neon mascot avatar. Style: glitch, datamosh, magenta and cyan lighting, neon outline, retro-futuristic. Subject: stylized anthropomorphic figure reflecting traits of {voice}, with subtle visual cues for {domains}. No real human likeness. No text. Square 1:1, dark background.',
  retro_pixel: '16-bit pixel sprite mascot avatar. Style: retro pixel art, limited 8-color palette, soft inner glow. Subject: stylized character reflecting {voice}, themed around {domains}. No real human likeness. No text. Square 1:1.',
  anime_portrait: 'Anime portrait mascot avatar. Style: clean line art, expressive eyes, soft cel shading, modern anime. Subject: stylized character whose vibe reads as {voice}, with subtle visual cues for {domains}. No real human likeness. No text. Square 1:1.',
  hand_sketched: 'Hand-sketched mascot avatar. Style: pencil and ink on paper, organic feel, slight texture, monochrome with one accent color. Subject: simple figure or creature reflecting {voice}, themed around {domains}. No text. Square 1:1.',
  liquid_gold: 'Liquid Gold mascot avatar. Style: molten gold and warm cream, premium feel, soft warm light, polished texture, dark background. Subject: stylized abstract or figure reflecting {voice}, evocative of {domains}. No real human likeness. No text. Square 1:1.',
  dark_glass: 'Dark Glass mascot avatar. Style: frosted glass, terminal vibes, monochrome with one cyan accent, technical aesthetic. Subject: minimalist figure or symbol reflecting {voice}, themed around {domains}. No text. Square 1:1.',
  comic_ink: 'Comic-ink mascot avatar. Style: bold ink lines, halftone shading, comic-book panel feel, two-color limited palette. Subject: stylized character reflecting {voice}, themed around {domains}. No text. Square 1:1.',
  specimen_plate: 'Specimen plate mascot avatar. Style: laboratory card, amber and cinnabar palette, parchment background, monospace label, scientific instrument feel. Subject: numbered specimen or instrument reflecting {voice}, themed around {domains}. No text. Square 1:1.',
};

export const MASCOT_STYLES = Object.keys(MASCOT_TEMPLATES);

export function buildMascotPrompt(style, { handle, profile }) {
  const template = MASCOT_TEMPLATES[style] || MASCOT_TEMPLATES.specimen_plate;
  const voiceList = (profile?.voice_traits || []).slice(0, 4).join(', ') || 'thoughtful and curious';
  const domainList = (profile?.domains || []).slice(0, 3).join(', ') || 'building and creating';
  return template
    .replace(/\{voice\}/g, voiceList)
    .replace(/\{domains\}/g, domainList)
    .replace(/\{handle\}/g, handle || 'agent');
}

export function isValidStyle(style) {
  return Object.prototype.hasOwnProperty.call(MASCOT_TEMPLATES, style);
}

export function buildXIntentForMascot(style, handle) {
  const text = `Building my @grok-install AI agent. Mascot style: ${style.replace(/_/g, ' ')}. /${handle}`;
  return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
