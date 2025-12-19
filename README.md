Archived for now because I lack time and interest in working on this. Maybe in the future I'll try to get this back up working.

---

<img align="right" src="https://github.com/AlexProgrammerDE/PistonPanel/blob/main/public/logo.png?raw=true" height="150" width="150">

<a href="https://github.com/AlexProgrammerDE/PistonPanel/actions/workflows/build.yml"><img src="https://github.com/AlexProgrammerDE/PistonPanel/actions/workflows/build.yml/badge.svg?branch=main" alt="Test"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/graphs/contributors"><img src="https://img.shields.io/github/contributors/AlexProgrammerDE/PistonPanel.svg" alt="Contributors"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/blob/main/LICENSE"><img src="https://img.shields.io/github/license/AlexProgrammerDE/PistonPanel.svg" alt="License"></a>

<a href="https://discord.gg/vHgRd6YZmH"><img src="https://discordapp.com/api/guilds/739784741124833301/embed.png" alt="Discord embed"></a>

# PistonPanel

**🌠 Next-gen game-server hosting panel**

## About

> [!NOTE]
> PistonPanel is currently in early development; you cannot use this project yet. Many features are missing, so you'll
> have to wait a bit until everything is ready. Check back to see if anything has changed.

PistonPanel is a web-based game server management panel that allows you to manage your game servers from anywhere.
It is designed to be easy to use and provides a modern interface for managing your game servers.

Unique features of PistonPanel:

- Organisations: Manage multiple servers in one place. Invite members to your organisation to collaborate.
- Kubernetes: While other panels rely on Docker, PistonPanel is built with only Kubernetes support, providing multi-node
  features like no other panel can.
- Auth: With a highly advanced authentication system, support login methods like Passkeys, 2FA, email codes, magic
  links, Google, Microsoft, Apple... and more!
- Fully customizable: If you know React and TypeScript, you can modify the panel code to your liking.

## Building

PistonPanel has a lot of dependencies. You'll need pnpm and the latest node installed.
Take a look at the scripts in `package.json` to see how to run a dev env locally.
You can also refer to the GitHub actions workflows to see how tests are done.

## Generate better-auth schema

```bash
pnpm dlx @better-auth/cli@latest generate --config ./server/auth/auth-server.tsx  --output ./server/db/auth-schema.ts
```

## Local Postgres

### Setup container

```bash
docker run --name pistonpanel-dev-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### Start after boot

```bash
docker start pistonpanel-dev-postgres
```

## Local k8s

### Install cillium

```bash
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/master/stable.txt)
CLI_ARCH=amd64
if [ "$(uname -m)" = "aarch64" ]; then CLI_ARCH=arm64; fi
curl -L --fail --remote-name-all https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}
sha256sum --check cilium-linux-${CLI_ARCH}.tar.gz.sha256sum
sudo tar xzvfC cilium-linux-${CLI_ARCH}.tar.gz /usr/local/bin
rm cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}
```

### Start minikube

```bash
minikube addons enable metrics-server
minikube addons enable dashboard
minikube addons enable portainer
minikube start --network-plugin=cni --cni=cilium --driver=docker
```

## Drizzle

https://orm.drizzle.team/docs/kit-overview

### Create migration

```bash
pnpm drizzle-kit generate --name=<name>
```

### Run migrations

```bash
pnpm drizzle-kit migrate
```

### Push schema to db

```bash
pnpm drizzle-kit push
```

### Open Studio

URL: https://local.drizzle.studio

```bash
pnpm drizzle-kit studio
```
