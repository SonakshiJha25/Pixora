/**
 * Production-safe logging: concise messages, no secrets in output.
 * Never pass full req.body, tokens, or connection strings into these helpers.
 */

const NS = "[pixora]";
const isProd = process.env.NODE_ENV === "production";

function redactSensitive(text) {
  if (typeof text !== "string") return String(text);
  return text
    .replace(/mongodb(\+srv)?:\/\/[^\s"'`]+/gi, "[mongodb-uri]")
    .replace(/Bearer\s+[\w.-]+/gi, "Bearer [redacted]")
    .replace(/CLIPDROP_API[=:]\s*[\w.-]+/gi, "CLIPDROP_API=[redacted]");
}

function trim(text, max = 400) {
  const s = redactSensitive(String(text ?? "").trim());
  if (!s) return "";
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

export function logInfo(message) {
  console.log(NS, trim(message));
}

export function logWarn(message) {
  console.warn(NS, trim(message));
}

/**
 * @param {string} context - Short description, e.g. "MongoDB connection failed"
 * @param {Error|null} [err]
 */
export function logError(context, err) {
  const head = trim(context);
  if (err && typeof err === "object") {
    const msg = err.message ? trim(err.message, 300) : "";
    const code = err.code ? ` code=${err.code}` : "";
    const suffix = msg ? ` — ${msg}` : "";
    console.error(NS, `${head}${suffix}${code}`);
    if (!isProd && typeof err.stack === "string" && err.stack) {
      console.error(trim(err.stack, 2500));
    }
  } else {
    console.error(NS, head);
  }
}
