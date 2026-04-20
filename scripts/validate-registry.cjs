"use strict";

const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020").default;
const addFormats = require("ajv-formats").default;

const repoRoot = path.join(__dirname, "..");
const schemaPath = path.join(repoRoot, "schema", "app-record.schema.json");
const appsDir = path.join(repoRoot, "registry", "apps");

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validate = ajv.compile(schema);

const files = fs
  .readdirSync(appsDir)
  .filter((f) => f.endsWith(".app.json"))
  .sort();

let ok = true;
for (const f of files) {
  const full = path.join(appsDir, f);
  const data = JSON.parse(fs.readFileSync(full, "utf8"));
  if (!validate(data)) {
    console.error(full);
    console.error(validate.errors);
    ok = false;
  }
}

if (!ok) {
  process.exit(1);
}

console.log(
  `registry validation OK (${files.length} file(s): ${files.join(", ")})`
);
