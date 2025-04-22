use log::{error, info};
use std::net::TcpListener;
use std::path::PathBuf;
use std::sync::Arc;

#[derive(Debug, thiserror::Error)]
#[non_exhaustive]
pub enum SFError {
    #[error("checksum of downloaded jvm data does not match")]
    InvalidJvmChecksum,
    #[error("json field was invalid/not found: {0}")]
    JsonFieldInvalid(String),
    #[error("jwt line was invalid")]
    JwtLineInvalid,
    #[error("path could not be converted to string")]
    PathCouldNotBeConverted,
    #[error("no content length header present")]
    NoContentLengthHeader,
    #[error("no port available")]
    NoPortAvailable,
    #[error("invalid zip data")]
    InvalidZipData,
    #[error("invalid jre archive file extension")]
    InvalidArchiveType,
    #[cfg(desktop)]
    #[error("no default window icon")]
    NoDefaultWindowIcon,
    #[cfg(desktop)]
    #[error("no main window")]
    NoMainWindow,
    #[error("download failed")]
    DownloadFailed,
    #[error("server already starting")]
    ServerAlreadyStarting,
}

#[derive(Debug, thiserror::Error)]
pub enum SFAnyError {
    #[error(transparent)]
    SFError(#[from] SFError),
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Tauri(#[from] tauri::Error),
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
    #[error(transparent)]
    FromUtf8(#[from] std::string::FromUtf8Error),
    #[error(transparent)]
    ZipError(#[from] zip::result::ZipError),
    #[cfg(desktop)]
    #[error(transparent)]
    UpdaterError(#[from] tauri_plugin_updater::Error),
    #[error(transparent)]
    DiscordError(#[from] discord_presence::DiscordError),
    #[error(transparent)]
    MDNSSSError(#[from] mdns_sd::Error),
    #[error(transparent)]
    RecvError(#[from] std::sync::mpsc::RecvError),
    #[error(transparent)]
    RustCastError(#[from] rust_cast::errors::Error),
    #[error(transparent)]
    SerdeError(#[from] serde_json::Error),
    #[error(transparent)]
    SendError(#[from] std::sync::mpsc::SendError<String>),
    #[error(transparent)]
    SystemTimeError(#[from] std::time::SystemTimeError),
    #[error(transparent)]
    ShellError(#[from] tauri_plugin_shell::Error),
}

impl serde::Serialize for SFAnyError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
