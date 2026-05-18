import { DEFAULT_BACKEND_ORIGIN } from "../config/backendOrigin.js";
import { getRequestBaseUrl } from "../config/api.js";

export function isLocalDevHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

/** User-facing hint when axios cannot reach the backend (no HTTP response). */
export function apiUnreachableMessage() {
  if (isLocalDevHost()) {
    return "Cannot reach the API. Start the server in the server folder (port 4000), then try again.";
  }
  const base = getRequestBaseUrl() || DEFAULT_BACKEND_ORIGIN;
  return `Cannot reach the API at ${base}. If you just deployed, wait a minute for Render to wake up, then refresh.`;
}
