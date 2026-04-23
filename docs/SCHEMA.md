# Registry Schema

`schema/app-record.schema.json` defines the required structure for app record JSON. Published app files live under `registry/apps/`; illustrative files that must not appear in host app listings live under `registry/examples/` (validated the same way).

## Naming and File Convention

- One file per app: `registry/apps/<app_id>.app.json`
- `app_id` should use lowercase letters, numbers, and dashes.

## Required Top-Level Fields

- `app_id`
- `display_name`
- `owner`
- `status`
- `signing_keys[]`
- `created_at`
- `updated_at`

## Signing Key Requirements

Each entry in `signing_keys[]` must include:

- `kty: "OKP"`
- `crv: "Ed25519"`
- `alg: "EdDSA"`
- `x` (public key material, base64url)
- `status` (`active`, `retired`, or `revoked`)

Optional key fields:

- `kid`
- `created_at`
- `updated_at`

## Validation

PRs are validated by GitHub Actions workflow `validate-registry`.

Required merge check:

- `validate-registry`

Local validation example:

```bash
ajv validate -c ajv-formats -s schema/app-record.schema.json -d "registry/apps/*.app.json"
ajv validate -c ajv-formats -s schema/app-record.schema.json -d "registry/examples/*.app.json"
```

Alternatively run `npm run validate:registry` from the repo root (checks both directories).
