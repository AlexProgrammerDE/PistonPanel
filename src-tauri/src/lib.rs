#![feature(let_chains)]

use crate::discord::load_discord_rpc;
use log::{error, info};
use std::ops::Deref;
use std::sync::Arc;
use std::sync::atomic::AtomicBool;
use std::{env, thread};
use tauri::async_runtime::Mutex;
use tauri::{Emitter, Listener, Manager};
use tauri_plugin_log::fern::colors::Color;
#[cfg(desktop)]
use tauri_plugin_updater;
mod discord;
#[cfg(desktop)]
mod tray;
#[cfg(desktop)]
mod updater;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default().plugin(tauri_plugin_opener::init());

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
        builder = builder.plugin(
            tauri_plugin_window_state::Builder::new()
                .with_state_flags(
                    tauri_plugin_window_state::StateFlags::all()
                        - tauri_plugin_window_state::StateFlags::VISIBLE
                        - tauri_plugin_window_state::StateFlags::DECORATIONS,
                )
                .build(),
        )
    }

    builder
        .plugin(tauri_plugin_deep_link::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .level_for(
                    "discord_presence::connection::manager",
                    log::LevelFilter::Off,
                )
                .with_colors(tauri_plugin_log::fern::colors::ColoredLevelConfig {
                    error: Color::Red,
                    warn: Color::Yellow,
                    debug: Color::Cyan,
                    info: Color::Green,
                    trace: Color::Blue,
                })
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Webview,
                ))
                .max_file_size(50_000)
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .build(),
        )
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            std::panic::set_hook(Box::new(|panic_info| {
                error!("{}", format!("{}", panic_info).replace('\n', " "));
            }));

            thread::spawn(|| match load_discord_rpc() {
                Ok(_) => {}
                Err(error) => {
                    error!("Fatal discord error: {error}");
                }
            });

            #[cfg(desktop)]
            {
                let handle = app.handle();
                tray::create_tray(handle)?;
            }

            #[cfg(desktop)]
            {
                if env::var("SOULFIRE_DISABLE_UPDATER").is_err() {
                    app.handle()
                        .plugin(tauri_plugin_updater::Builder::new().build())?;
                    let handle = app.handle().clone();
                    tauri::async_runtime::spawn(async move {
                        match updater::update(handle).await {
                            Ok(()) => {
                                info!("Updater finished");
                            }
                            Err(error) => {
                                error!("An updater error occurred! {error}");
                            }
                        }
                    });
                }
            }

            #[cfg(desktop)]
            {
                let app_handle = app.handle().clone();
                app.listen("app-loaded", move |_event| {
                    app_handle
                        .get_webview_window("main")
                        .unwrap()
                        .show()
                        .unwrap();
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
