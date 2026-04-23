"use strict";

const fs = require("fs");
const path = require("path");
const Ajv2020 = require("ajv/dist/2020").default;
const addFormats = require("ajv-formats").default;

const repoRoot = path.join(__dirname, "..");
const schemaPath = path.join(repoRoot, "schema", "app-record.schema.json");
const appsDir = path.join(repoRoot, "registry", "apps");
const examplesDir = path.join(repoRoot, "registry", "examples");

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validate = ajv.compile(schema);

function listAppJsonFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".app.json"))
    .sort();
}

const appsFiles = listAppJsonFiles(appsDir);
const exampleFiles = listAppJsonFiles(examplesDir);
const toValidate = [
  ...appsFiles.map((f) => path.join(appsDir, f)),
  ...exampleFiles.map((f) => path.join(examplesDir, f)),
];

let ok = true;
for (const full of toValidate) {
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

const appLabel = appsFiles.length ? `apps: ${appsFiles.join(", ")}` : "apps: (none)";
const exLabel = exampleFiles.length
  ? `examples: ${exampleFiles.join(", ")}`
  : "examples: (none)";
console.log(`registry validation OK (${appLabel}; ${exLabel})`);
