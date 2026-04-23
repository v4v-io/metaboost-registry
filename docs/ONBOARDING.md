# Onboarding

This guide walks through registering an app and preparing it to call Metaboost Standard Endpoints.

## 1) Generate Signing Keys

- Generate Ed25519 keypair in backend infrastructure.
- Keep private key secret.
- Do not expose private key to clients or commit it to Git.

## 2) Add App Record

Create:

- `registry/apps/<app_id>.app.json`

Use:

- `registry/examples/_example.app.json` (illustrative; not published alongside real apps)
- `schema/app-record.schema.json`
- `docs/SCHEMA.md`

## 3) Open Pull Request

- Create a branch (recommended: `registry/<app_id>-seed` for first submission).
- Submit PR with your app record changes.
- Ensure GitHub Actions check `validate-registry` passes.
- Merge only after required check is green.

## 4) After Merge

- Metaboost can use the merged public key metadata as registry source.
- You can begin sending signed requests from your backend API using the approved key pair.

## Related Docs

- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `docs/FIRST-APP-SUBMISSION.md`
