# OSD Downloader

A desktop application for downloading videos and playlists from YouTube and other platforms. Built as a learning project to understand cross-platform development using Tauri, React state management with Zustand, and media processing workflows.

## Core Features

### Video Downloads
- **Video Information Fetching**: Uses `yt-dlp --dump-single-json` command to extract metadata and available formats
- **Format Selection**: Presents available video/audio streams with resolution, codec, and file size information
- **Download Management**: Tracks active downloads with SQLite database persistence
- **Progress Tracking**: Real-time download status updates through command line parsing

### Playlist Support  
- **Playlist Parsing**: Extracts playlist metadata and individual video entries using `yt-dlp --yes-playlist`
- **Selective Downloads**: UI for selecting specific videos from playlists before downloading
- **Batch Processing**: Handles multiple simultaneous downloads with individual progress tracking

### State Management Architecture
- **Zustand Stores**: Multiple stores managing different aspects (video, playlist, download, theme, database)
- **Cross-Store Communication**: Coordinated state updates between video input, playlist, and download stores
- **Persistent Storage**: SQLite integration for download history and application preferences

## Technical Implementation

### Frontend (React + TypeScript)
- **Component Architecture**: Modular components with clear separation of concerns
- **Routing**: React Router for navigation between Home and About pages
- **UI Framework**: HeroUI components with Tailwind CSS for styling
- **State Management**: Zustand for client-side state with TypeScript interfaces

### Backend (Tauri + Rust)
- **Cross-Platform Desktop App**: Tauri framework for system integration
- **Process Management**: Shell plugin for spawning and managing yt-dlp/ffmpeg processes
- **File System Operations**: Reading/writing JSON files and managing download directories
- **Database Integration**: SQLite plugin for persistent data storage

### External Dependencies
- **yt-dlp**: Bundled binary for video information extraction and downloading
- **ffmpeg/ffprobe/ffplay**: Bundled media processing tools (though primarily using yt-dlp's built-in processing)

## Project Structure

```
src/
├── components/          # React UI components
│   ├── video/          # Video download interface
│   ├── playlist/       # Playlist management UI  
│   └── menuBar/        # Navigation and input components
├── store/              # Zustand state management
├── interfaces/         # TypeScript type definitions
└── routes/             # Page components

src-tauri/
├── src/                # Rust backend code
├── bin/                # Bundled executables (yt-dlp, ffmpeg)
└── capabilities/       # Tauri security configurations
```

## Key Learning Areas

This project demonstrates understanding of:

- **Cross-Platform Development**: Using Tauri to create desktop apps with web technologies
- **State Management Patterns**: Complex state coordination across multiple Zustand stores
- **Process Integration**: Spawning and managing external command-line tools
- **Database Integration**: SQLite for persistent storage in desktop applications
- **TypeScript Interfaces**: Type-safe communication between frontend and backend
- **Component Architecture**: Modular React components with clear responsibilities

## Tech Stack

- **Frontend**: React 18, TypeScript, HeroUI, Tailwind CSS, React Router
- **State Management**: Zustand with TypeScript interfaces
- **Desktop Framework**: Tauri v2 with Rust backend
- **Database**: SQLite with Tauri SQL plugin
- **Media Processing**: yt-dlp (primary), ffmpeg suite (bundled)
- **Build Tools**: Vite, TypeScript compiler

## Development Notes

The application handles the complexity of coordinating multiple asynchronous operations (video fetching, downloads, UI updates) while maintaining a responsive user interface. The state management approach uses multiple specialized stores rather than a single global state, allowing for better separation of concerns and easier testing of individual features.

The bundled binaries approach ensures the application works out-of-the-box without requiring users to install external dependencies, though this increases the application size significantly.
