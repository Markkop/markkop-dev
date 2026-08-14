# markkop.dev

Personal work and portfolio website for Marcelo Kopmann.

## Local development

```sh
pnpm install
pnpm dev
```

The site is a Next.js application with an independent Git history. Production runs as a standalone Docker container on the same VPS and shared Caddy network as Minha Casa. See `infra/vps/README.md` for operations.

## Publishing

The `origin` remote fetches from GitHub and has two push URLs, so a normal `git push origin main` publishes the same commit to GitHub and Forgejo.
