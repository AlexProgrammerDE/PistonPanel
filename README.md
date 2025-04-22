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

This is a frontend for the [PistonPanel server](https://github.com/AlexProgrammerDE/PistonPanel).
It mainly targets the web, but uses native APIs using Tauri.

> [!NOTE]
> For more info about PistonPanel, take a look at the main [PistonPanel repository](https://github.com/AlexProgrammerDE/PistonPanel).

## About the client

Built using latest web tech to consistently work on both web, desktop and mobile.
The client is the GUI for the PistonPanel server, but it uses the official PistonPanel gRPC API.
Anything that can be done using the SF client can also be done using gRPC HTTP API calls directly.

## Installation

> [!TIP]
> Want to check out how PistonPanel looks before installing it? Take a look at the official [demo page](https://demo.pistonpanelmc.com).

For installing PistonPanel, please refer to the [installation guide](https://pistonpanelmc.com/docs/installation).

<a href='https://flathub.org/apps/com.pistonpanelmc.pistonpanel'>
<img width='240' alt='Get it on Flathub' src='https://flathub.org/api/badge?locale=en'/>
</a>

## Deployments

See which branches are at which URLs:

- [`release`](https://app.pistonpanelmc.com) -> app.pistonpanelmc.com
- [`main`](https://preview.pistonpanelmc.com) -> preview.pistonpanelmc.com
- [`demo`](https://demo.pistonpanelmc.com) -> demo.pistonpanelmc.com

## Building

The client has a lot of dependencies. You'll need pnpm, latest node and a nightly rust toolchain installed.
Take a look at the scripts in `package.json` to see how to run a dev env locally.
You can also refer to the GitHub actions workflows to see how production builds are made.

## Sponsors

<table>
 <tbody>
  <tr>
   <td align="center"><img alt="[SignPath]" src="https://avatars.githubusercontent.com/u/34448643" height="30"/></td>
   <td>Free code signing on Windows provided by <a href="https://signpath.io/?utm_source=foundation&utm_medium=github&utm_campaign=pistonpanel">SignPath.io</a>, certificate by <a href="https://signpath.org/?utm_source=foundation&utm_medium=github&utm_campaign=pistonpanel">SignPath Foundation</a></td>
  </tr>
 </tbody>
</table>
