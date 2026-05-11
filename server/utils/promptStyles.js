export const PROMPT_STYLES = {
  realistic: "ultra realistic lighting, detailed textures, cinematic look",
  anime: "anime style, vibrant colors, cel-shaded, high detail",
  cyberpunk: "cyberpunk neon lights, futuristic city, dramatic atmosphere",
  fantasy: "epic fantasy concept art, magical ambience, rich details",
  minimal: "minimal clean composition, soft colors, modern design",
};

export const enhancePrompt = (prompt, style = "realistic") => {
  const cleanPrompt = String(prompt || "").trim().replace(/\s+/g, " ");
  const styleHint = PROMPT_STYLES[style] || PROMPT_STYLES.realistic;
  return `${cleanPrompt}. Style: ${styleHint}`;
};
