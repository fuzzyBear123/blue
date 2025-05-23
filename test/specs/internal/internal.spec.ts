import { describe, it } from "vitest";
import $RefParser from "../../../lib/index.js";
import helper from "../../utils/helper.js";
import path from "../../utils/path.js";
import parsedSchema from "./parsed.js";
import dereferencedSchema from "./dereferenced.js";
import bundledSchema from "./bundled.js";

import { expect } from "vitest";

describe("Schema with internal $refs", () => {
  it("should parse successfully", async () => {
    let parser = new $RefParser();
    let schema = await parser.parse(path.rel("test/specs/internal/internal.yaml"));
    expect(schema).to.equal(parser.schema);
    expect(schema).to.deep.equal(parsedSchema);
    expect(parser.$refs.paths()).to.deep.equal([path.abs("test/specs/internal/internal.yaml")]);
  });

  it(
    "should resolve successfully",
    helper.testResolve(
      path.rel("test/specs/internal/internal.yaml"),
      path.abs("test/specs/internal/internal.yaml"),
      parsedSchema,
    ),
  );

  it("should dereference successfully", async () => {
    let parser = new $RefParser();
    let schema = await parser.dereference(path.rel("test/specs/internal/internal.yaml"));
    expect(schema).to.equal(parser.schema);
    expect(schema).to.deep.equal(dereferencedSchema);
    // Reference equality
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(schema.properties.name).to.equal(schema.definitions.name);
    // @ts-expect-error TS(2532): Object is possibly 'undefined'.
    expect(schema.definitions.requiredString)
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      .to.equal(schema.definitions.name.properties.first)
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      .to.equal(schema.definitions.name.properties.last)
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      .to.equal(schema.properties.name.properties.first)
      // @ts-expect-error TS(2532): Object is possibly 'undefined'.
      .to.equal(schema.properties.name.properties.last);
    // The "circular" flag should NOT be set
    expect(parser.$refs.circular).to.equal(false);
  });

  it("should bundle successfully", async () => {
    let parser = new $RefParser();
    let schema = await parser.bundle(path.rel("test/specs/internal/internal.yaml"));
    expect(schema).to.equal(parser.schema);
    expect(schema).to.deep.equal(bundledSchema);
  });
});
