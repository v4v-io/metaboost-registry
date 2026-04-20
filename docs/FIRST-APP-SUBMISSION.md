# First App Submission

Use the repo tooling to create or update `registry/apps/<app_id>.app.json` so key material, JWK constants, and timestamps stay consistent.

## Choose An Environment

### Option A — Nix (recommended)

- **Linux and macOS**: [`flake.nix`](../flake.nix) and `flake.lock` pin **OpenSSL 3** (Ed25519), **Python 3**, and **Node.js** so you do not chase per-machine toolchain versions.
- **Windows**: Use **WSL2** with a Linux distribution, install the [Nix package manager](https://nixos.org/download/) inside that Linux environment, then follow the same steps as on Linux. This repository does not document Nix on native Windows (CMD/PowerShell without WSL) as a supported workflow.
- **macOS**: Once you are in `nix develop`, Nix supplies OpenSSL; avoiding the system default LibreSSL vs Homebrew split is a major reason to prefer this option on macOS.

```bash
cd /path/to/metaboost-registry
nix develop
npm ci
```

### Option B — Local CLI

Install **Git**, **Python 3**, **Node.js** (includes `npm`), and an **OpenSSL** that supports Ed25519. Check with `openssl genpkey -algorithm ed25519` or `openssl list -public-key-algorithms` (look for `ed25519`). If the wrong binary is on your `PATH`, set **`OPENSSL_BIN`** to the full path of a suitable `openssl` (or `openssl.exe` on Windows).

| OS | Notes |
|----|--------|
| **Linux** | Most distributions ship OpenSSL 3; if not, install it with your package manager and set `OPENSSL_BIN` if needed. |
| **macOS** | The default `openssl` is often **LibreSSL** (no Ed25519). Install OpenSSL 3 (for example via Homebrew) and set `OPENSSL_BIN`, for example Apple Silicon: `/opt/homebrew/opt/openssl@3/bin/openssl`, Intel: `/usr/local/opt/openssl@3/bin/openssl`. |
| **Windows** (native, not WSL) | Install Git, Python 3, and Node.js. Install a maintained **OpenSSL 3** build for Windows (vendor of your choice), then set `OPENSSL_BIN` to that `openssl.exe` if `openssl` in `PATH` is too old or lacks Ed25519. |

Example (Unix-like shells):

```bash
export OPENSSL_BIN="/path/to/openssl-with-ed25519"
cd /path/to/metaboost-registry
npm ci
```

## Primary Tool (English): `scripts/en/registry-app`

Interactive prompts are implemented under **`scripts/en/`** so other locales can add parallel scripts later (for example `scripts/de/registry-app`).

**How to run it**

- **Linux, macOS, WSL2, or Git Bash on Windows**: use the bash entrypoint from the repository root:

```bash
./scripts/registry-app
```

That shim runs the English implementation. You can also invoke `./scripts/en/registry-app` directly.

- **Windows (PowerShell or CMD)**: the shim is bash-based; run the Python script instead (from the repository root):

```text
py -3 scripts\en\registry-app
```

or `python scripts\en\registry-app` if `py` is not available.

You will be prompted for `app_id` first.

- **Create**: if `registry/apps/<app_id>.app.json` does not exist, the script runs the **create** flow (Ed25519 keypair under `~/.config/metaboost-registry/keys/`, builds the first `signing_keys[]` entry with fixed `kty` / `crv` / `alg`, writes the JSON file, then runs `npm run validate:registry`).
- **Update**: if the file **already exists**, the script runs the **update** flow. **Press Enter** at a prompt to **keep the current value**. Optional `owner.url` must be **https://** only (Metaboost requires HTTPS); type a single `-` to remove it. If an existing record has `http://`, the script asks you to fix or remove it. You may optionally **add a new signing key** (rotation) when prompted.

Schema constants (`kty`, `crv`, `alg`) are never prompted; they are always set to OKP / Ed25519 / EdDSA.

## Validate, Branch, PR

After the script writes your file:

```bash
npm run validate:registry
git checkout -b "registry/<app_id>-seed"
git add "registry/apps/<app_id>.app.json"
git status   # confirm no private keys staged
git commit -m "Add <app_id> seed app record"
git push -u origin "registry/<app_id>-seed"
```

Open a pull request in the GitHub web UI. The `validate-registry` workflow must pass before merge.

## After Merge

Record the PR URL and the merged commit SHA for your own audit trail.

## Security

- Never commit private keys; the script stores them under `~/.config/metaboost-registry/keys/`, not in the repo.
- Do not generate keys inside the repository directory.
