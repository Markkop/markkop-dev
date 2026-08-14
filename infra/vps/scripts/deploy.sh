#!/usr/bin/env sh
set -eu

PROJECT_DIR="/docker/markkop-dev"
FORGEJO_REPO="git@git.markkop.dev:markkop/markkop-dev.git"
GITHUB_REPO="git@github.com:Markkop/markkop-dev.git"

if [ ! -d "$PROJECT_DIR/.git" ]; then
  mkdir -p "$PROJECT_DIR"
  if ! git clone "$FORGEJO_REPO" "$PROJECT_DIR"; then
    git clone "$GITHUB_REPO" "$PROJECT_DIR"
  fi
fi

cd "$PROJECT_DIR"
git checkout main
git pull --ff-only origin main

docker network inspect caddy_net >/dev/null 2>&1 || docker network create caddy_net
docker compose -f infra/vps/docker-compose.yml up -d --build

attempt=0
while [ "$attempt" -lt 18 ]; do
  status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' markkop-dev-1 2>/dev/null || true)"
  if [ "$status" = "healthy" ]; then
    printf '%s\n' "markkop.dev container is healthy at $(git rev-parse --short HEAD)"
    exit 0
  fi
  attempt=$((attempt + 1))
  sleep 5
done

docker compose -f infra/vps/docker-compose.yml logs --tail=120 markkop-dev
exit 1
