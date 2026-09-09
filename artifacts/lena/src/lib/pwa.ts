/**
 * Minimal PWA support (REMEDIATION_PLAN M5 / OPEN_DECISIONS Part B-7):
 * a web manifest plus an offline fallback page served by a small service
 * worker. Nothing here tracks the user and no request is ever stored on
 * disk beyond the static shell Vite already ships.
 *
 * Registration is deliberately conservative:
 *  - production builds only (the dev server must never own a worker);
 *  - secure contexts only (service workers require one; localhost is
 *    treated as secure by browsers but the preview host is where visual
 *    guardians run, and a worker must never stand between the guardian
 *    and the network bytes it is verifying);
 *  - never on preview-like hosts for that same reason.
 */

export interface ServiceWorkerEnvironment {
  /** import.meta.env.PROD — true only in a production build */
  isProdBuild: boolean;
  /** navigator.serviceWorker present */
  supportsServiceWorker: boolean;
  /** window.isSecureContext */
  isSecureContext: boolean;
  /** window.location.hostname */
  host: string;
}

const PREVIEW_HOST_PATTERN = /(^|\.)(localhost|127\.0\.0\.1|0\.0\.0\.0)$|preview|e2b\.app/i;

/**
 * Pure decision: should this page register the offline service worker?
 * Exposed for unit tests; `registerServiceWorker` applies it to the real
 * environment.
 */
export function shouldRegisterServiceWorker(env: ServiceWorkerEnvironment): boolean {
  if (!env.isProdBuild || !env.supportsServiceWorker || !env.isSecureContext) return false;
  return !PREVIEW_HOST_PATTERN.test(env.host);
}

/** URL of the worker relative to the deployment base (handles the /lena mount). */
export const serviceWorkerUrl = `${import.meta.env.BASE_URL}sw.js`;

export function registerServiceWorker(env: ServiceWorkerEnvironment = {
  isProdBuild: import.meta.env.PROD,
  supportsServiceWorker: typeof navigator !== "undefined" && "serviceWorker" in navigator,
  isSecureContext: typeof window !== "undefined" && window.isSecureContext,
  host: typeof window !== "undefined" ? window.location.hostname : "",
}): void {
  if (!shouldRegisterServiceWorker(env)) return;
  // Wait for the first paint; registering earlier only competes with the
  // initial load for bandwidth.
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(serviceWorkerUrl, { scope: import.meta.env.BASE_URL }).catch(() => {
      // Offline support is an enhancement: a failed registration must never
      // surface as an error to the visitor.
    });
  });
}
