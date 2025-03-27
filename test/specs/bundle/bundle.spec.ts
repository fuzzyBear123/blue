import { describe, it } from "vitest";
import { expect } from "vitest";
import $RefParser from "../../../lib/index.js";
import path from "../../utils/path";
import dereferencedSchema from "./bundled";

describe("Bundles", () => {
  it("should bundle correctly", async () => {
    let parser = new $RefParser();
    let schema = path.rel("test/specs/bundle/schemaA.json");
    let bundled = await parser.bundle(schema);
    expect(bundled).to.deep.equal(dereferencedSchema);
  });
});
