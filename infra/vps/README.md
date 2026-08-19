# markkop.dev VPS deployment

Production is a Coolify application on Hostinger VPS `srv1176823`, not a Compose stack under `/docker`.

Coolify builds the root `Dockerfile`, publishes port 3000, and attaches `https://markkop.dev` plus `https://www.markkop.dev`. Traefik (`coolify-proxy`, image `traefik:v3.6`) terminates TLS on the shared `coolify` network. HTTP is redirected to HTTPS by Traefik. Next.js also defines `www` → apex redirects.

Operate the app from `https://coolify.markkop.dev` (deploy, logs, rollback). Do not run a local compose file or reload Caddy on this host.

## Retired layout

These paths and files described the pre-Coolify Caddy proxy. They no longer exist on the server and must not be reintroduced:

- `/docker/markkop-dev`
- `/docker/caddy` / `caddy-caddy-1`
- Docker network `caddy_net`
- `infra/vps/Caddyfile`, `infra/vps/docker-compose.yml`, `infra/vps/scripts/deploy.sh`

DNS for the apex and `www` is still managed in Porkbun and should keep pointing at the VPS.
