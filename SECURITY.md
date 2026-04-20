# Security Policy

## Scope

This repository is public and must only contain non-sensitive app metadata and public signing keys.

## Prohibited Content

Do not commit:

- private keys
- secret values
- API credentials
- seed phrases

## Key Compromise Process

If a signing key is compromised:

1. Open an urgent PR updating the app record.
2. Set compromised key status to `revoked`.
3. Add a replacement key in `signing_keys[]` if needed.
4. Update `updated_at`.
5. Ensure `validate-registry` passes and merge immediately.

## Reporting Security Issues

For repository security concerns, contact the listed app owner in the affected app record and the Metaboost maintainers through your established security contact channel.

Do not publish private incident details in public issues.
