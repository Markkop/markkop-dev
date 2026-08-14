# markkop.dev VPS deployment

The portfolio follows Minha Casa's VPS convention: projects live under `/docker`, application containers join the external `caddy_net`, and the shared `/docker/caddy` stack owns public HTTPS.

## First deployment

Clone either published repository into `/docker/markkop-dev`, then run:

```sh
chmod +x infra/vps/scripts/deploy.sh
infra/vps/scripts/deploy.sh
```

Add the contents of `infra/vps/Caddyfile` to `/docker/caddy/Caddyfile`, validate it, and reload the existing proxy:

```sh
docker exec caddy-caddy-1 caddy validate --config /etc/caddy/Caddyfile
docker exec caddy-caddy-1 caddy reload --config /etc/caddy/Caddyfile
```

The DNS cutover is managed separately in Porkbun. Both `markkop.dev` and `www.markkop.dev` should resolve to the VPS before relying on automatic TLS issuance.

## Operations

```sh
docker compose -f infra/vps/docker-compose.yml ps
docker compose -f infra/vps/docker-compose.yml logs --tail=100 markkop-dev
docker compose -f infra/vps/docker-compose.yml restart markkop-dev
infra/vps/scripts/deploy.sh
```

For rollback, check out the previous known-good commit in `/docker/markkop-dev` and run `docker compose -f infra/vps/docker-compose.yml up -d --build`.
