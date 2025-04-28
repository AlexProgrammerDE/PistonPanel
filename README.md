# PistonPanel

<!--suppress HtmlDeprecatedAttribute -->
<p align="center">
<a href="https://github.com/AlexProgrammerDE/PistonPanel/actions/workflows/build.yml"><img src="https://github.com/AlexProgrammerDE/PistonPanel/actions/workflows/build.yml/badge.svg?branch=main" alt="Test"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/graphs/contributors"><img src="https://img.shields.io/github/contributors/AlexProgrammerDE/PistonPanel.svg" alt="Contributors"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/blob/main/LICENSE"><img src="https://img.shields.io/github/license/AlexProgrammerDE/PistonPanel.svg" alt="License"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/releases/latest"><img alt="GitHub all releases downloads" src="https://img.shields.io/github/downloads/AlexProgrammerDE/PistonPanel/total"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/releases/latest"><img alt="GitHub latest release downloads" src="https://img.shields.io/github/downloads/AlexProgrammerDE/PistonPanel/latest/total"></a>
<a href="https://github.com/AlexProgrammerDE/PistonPanel/releases/latest"><img src="https://img.shields.io/github/release/AlexProgrammerDE/PistonPanel.svg" alt="Current Release"></a>
</p>
<p align="center"><a href="https://discord.gg/vHgRd6YZmH"><img src="https://discordapp.com/api/guilds/739784741124833301/embed.png" alt="Discord embed"></a></p>

## About PistonPanel

Built using latest web tech to consistently work on both web and as a PWA.
PistonPanel is a web-based game server management panel that allows you to manage your game servers from anywhere.
It is designed to be easy to use and provides a modern interface for managing your game servers.

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
