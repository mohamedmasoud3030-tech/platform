import { describe, expect, it } from "vitest";
import { shouldRegisterServiceWorker, type ServiceWorkerEnvironment } from "./pwa";

function env(overrides: Partial<ServiceWorkerEnvironment> = {}): ServiceWorkerEnvironment {
  return {
    isProdBuild: true,
    supportsServiceWorker: true,
    isSecureContext: true,
    host: "lena.example.com",
    ...overrides,
  };
}

describe("shouldRegisterServiceWorker", () => {
  it("registers on a production build on a real https domain", () => {
    expect(shouldRegisterServiceWorker(env())).toBe(true);
  });

  it("never registers in a development build", () => {
    expect(shouldRegisterServiceWorker(env({ isProdBuild: false }))).toBe(false);
  });

  it("never registers where service workers are unsupported", () => {
    expect(shouldRegisterServiceWorker(env({ supportsServiceWorker: false }))).toBe(false);
  });

  it("never registers outside a secure context", () => {
    expect(shouldRegisterServiceWorker(env({ isSecureContext: false }))).toBe(false);
  });

  it("never registers on localhost or loopback preview hosts", () => {
    for (const host of ["localhost", "127.0.0.1", "0.0.0.0", "preview-abc.vercel.app", "abc.e2b.app"]) {
      expect(shouldRegisterServiceWorker(env({ host })), host).toBe(false);
    }
  });

  it("registers on ordinary production hostnames", () => {
    expect(shouldRegisterServiceWorker(env({ host: "lenastore.example.com" }))).toBe(true);
  });
});
