# markkop.dev

Personal work and portfolio website for Marcelo "Mark" Kopmann.

## Local development

```sh
pnpm install
pnpm dev
```

## Production

The site is a Next.js standalone Docker image. Production runs as a Coolify Dockerfile application on the same Hostinger VPS as Minha Casa (`srv1176823`). Public HTTPS is Coolify's `coolify-proxy` (Traefik v3) on the shared `coolify` Docker network.

- URLs: `https://markkop.dev`, `https://www.markkop.dev`
- Runtime: Dockerfile at the repo root, port 3000, health check `GET /`
- Panel: `https://coolify.markkop.dev`
- Source: GitHub App (`Markkop/markkop-dev`) on `main`, with auto-deploy enabled

The old `/docker` + Caddy layout (`caddy_net`, `/docker/caddy`, `/docker/markkop-dev`) is gone from the host. Do not restore it; a second proxy would fight Traefik on `:80`/`:443`. Host desired-state lives in the separate `vps-ops` repository.

## Publishing

The `origin` remote fetches from GitHub and has two push URLs, so a normal `git push origin main` publishes the same commit to GitHub and Forgejo. A signed GitHub push webhook asks Coolify to build and deploy updates to `main`.
