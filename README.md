<img align="right" src="https://github.com/AlexProgrammerDE/PistonPanel/blob/main/public/logo.png?raw=true" height="150" width="150">

<a href="https://github.com/AlexProgrammerDE/PistonPanel/actions/workflows/build.yml"><img src="https://github.com/AlexProgrammerDE/PistonPanel/actions/workflows/build.yml/badge.svg?branch=main" alt="Test"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/graphs/contributors"><img src="https://img.shields.io/github/contributors/AlexProgrammerDE/PistonPanel.svg" alt="Contributors"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/blob/main/LICENSE"><img src="https://img.shields.io/github/license/AlexProgrammerDE/PistonPanel.svg" alt="License"></a>

<a href="https://discord.gg/vHgRd6YZmH"><img src="https://discordapp.com/api/guilds/739784741124833301/embed.png" alt="Discord embed"></a>

# PistonPanel

*🌠 Next-gen game-server hosting panel*

## About

> [!NOTE]  
> PistonPanel is currently in development, but you cannot use this project yet. Many features are missing, so you'll have to wait a bit until everything is ready. Check back to see if anything has changed.

PistonPanel is a web-based game server management panel that allows you to manage your game servers from anywhere.
It is designed to be easy to use and provides a modern interface for managing your game servers.

Unique features of PistonPanel:
- Organisations - Manage multiple servers in one place. Invite members to your organisation to collaborate.
- Kubernetes - While other panels rely on Docker, PistonPanel is built with only Kubernetes support, providing multi-node features like no other panel can.
- Auth - With a highly advanced authentication system, support login methods like Passkeys, 2FA, email codes, magic links, Google, Microsoft, Apple... and more!
- Fully customnizable - If you know React and Typescript, you can modify the panel code to your liking.

## Installation

For installing PistonPanel, please refer to the [installation guide](https://pistonpanel.com/docs/installation).

## Building

PistonPanel has a lot of dependencies. You'll need pnpm and latest node installed.
Take a look at the scripts in `package.json` to see how to run a dev env locally.
You can also refer to the GitHub actions workflows to see how tests are done.

## Generate better-auth schema

```bash
npx @better-auth/cli@latest generate --config ./src/auth/auth-server.tsx  --output ./src/db/auth-schema.ts
```

## Local Postgres

```bash
docker run --name dev-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```
