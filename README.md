# 🎆 YT-DLP GUI - Tauri v2 + React + Zustand + HeroUI

A lightweight desktop GUI for `yt-dlp`, built using [Tauri v2](https://tauri.app/), [React TypeScript](https://react.dev/), [Zustand](https://github.com/pmndrs/zustand), and [HeroUI](https://www.heroui.com/).

## ⚙️ Features

- Clean and minimal UI for downloading videos via `yt-dlp`
- Playlist and individual video download support
- Format selection and audio/video filters
- Integrated logging and real-time download progress
- Cross-platform (Windows, macOS, Linux)

## 🧩 Requirements

Please ensure the following tools are installed and accessible from your system `PATH`:

- [yt-dlp.exe](https://github.com/yt-dlp/yt-dlp) (must be named exactly `yt-dlp.exe` meaning on the terminal your command 'yt-dlp --version should provide its version information, ytdlp,ytdlpx64 blah blah is not supported!')
- [ffmpeg](https://ffmpeg.org/)
- [ffplay](https://ffmpeg.org/)
- [ffprobe](https://ffmpeg.org/)

> You can verify by running `yt-dlp.exe --version`, `ffmpeg`, `ffplay`, and `ffprobe` from a terminal or command prompt.
