# Metaboost Registry

Public registry of app metadata and public signing keys for integrations that call Metaboost Standard Endpoints.

## Purpose

- Provide a simple, auditable source of truth for app public keys.
- Keep registry data limited to app metadata plus public signing keys.
- Enforce validation on every pull request before merge.

## Repository Layout

- `registry/apps/` - one app file per app (`<app_id>.app.json`)
- `schema/app-record.schema.json` - JSON schema used to validate app files
- `docs/SCHEMA.md` - schema reference and validation notes
- `.github/workflows/validate-registry.yml` - required PR validation workflow

## App Record Format

Each app file must include:

- `app_id`
- `display_name`
- `owner`
- `status`
- `signing_keys[]`
- `created_at`
- `updated_at`

See `registry/apps/_example.app.json` and `docs/SCHEMA.md`.

## Contributor And Security Docs

- `CONTRIBUTING.md`
- `SECURITY.md`
- `docs/ONBOARDING.md`
- `docs/FIRST-APP-SUBMISSION.md`

Use `docs/FIRST-APP-SUBMISSION.md` for contributor setup on **Linux**, **macOS**, or **Windows** (use **WSL2** for the Nix workflow; native Windows can use the local CLI and `python`/`py` to run `scripts/en/registry-app`). The guide covers **`./scripts/registry-app`** (English UI under `scripts/en/`) for create/update app records, Ed25519 keys, validation, and PR steps.

## Pull Request Requirements

- App records must validate against `schema/app-record.schema.json`.
- GitHub Actions check `validate-registry` must pass before merge.
- Branch protection should require `validate-registry` as a status check.
