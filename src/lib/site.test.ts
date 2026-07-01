import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { siteUrl } from "./site";

const KEYS = ["NEXT_PUBLIC_SITE_URL", "VERCEL_PROJECT_PRODUCTION_URL"] as const;

describe("siteUrl", () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of KEYS) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });

  it("préfère NEXT_PUBLIC_SITE_URL et retire le slash final", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://pickact.app/";
    expect(siteUrl()).toBe("https://pickact.app");
  });

  it("retombe sur l'URL Vercel en https", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "pickact.vercel.app";
    expect(siteUrl()).toBe("https://pickact.vercel.app");
  });

  it("retombe sur localhost sans variable", () => {
    expect(siteUrl()).toBe("http://localhost:3000");
  });
});
