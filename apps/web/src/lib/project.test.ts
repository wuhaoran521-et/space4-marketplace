import { describe, expect, it } from "vitest";

describe("project test setup", () => {
  it("runs TypeScript tests", () => {
    expect("space-asset".includes("asset")).toBe(true);
  });
});
