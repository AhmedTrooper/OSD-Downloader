# OSD Downloader

A desktop media downloader built with Tauri and React, demonstrating cross-platform development, complex state management, and external process integration. This project showcases practical implementation of async operations, multi-store coordination, and CLI tool integration.

**Developer**: AhmedTrooper

---

## 🏗️ Core Features & Implementation

### 1. Video Information Extraction
**What it does**: Fetches video metadata and available formats from URLs using yt-dlp

**Core Implementation**:
```typescript
// src/store/UserInputVideoStore.ts - fetchVideoInformation()
fetchVideoInformation: async () => {
  const command = Command.sidecar("bin/yt-dlp", [
    "--dump-json", 
    `${videoUrl.trim()}`
  ]);

  await new Promise<void>((resolve) => {
    command.stdout.on("data", (line) => {
      jsonOutput = line;
    });
    
    command.on("close", async () => {
      if (noError) {
        await writeTextFile(filePath, jsonOutput, {
          baseDir: BaseDirectory.Document,
        });
        await readJsonFile();
      }
      resolve();
    });
    command.spawn();
  });
}
```

**Features**: 
- Automatic playlist vs single video detection
- JSON metadata caching to filesystem
- Error handling with user notifications

### 2. Format Selection System
**What it does**: Displays available video/audio streams with interactive selection

**Core Implementation**:
```typescript
// src/store/downloadStore.ts - Stream combination logic
videoStreamSelect: (vst: string) => {
  const selectedAudioStream = downloadStore.selectedAudioStream;
  setSelectedVideoStream(vst);
  
  if (selectedAudioStream) {
    let formatString = `${vst.trim()}+${selectedAudioStream.trim()}`.trim();
    setSelectedFormat(formatString);
  }
}
```

**Features**:
- Separate video and audio stream selection
- Automatic format string generation (`video+audio`)
- Real-time preview of selected combination
- Non-media format filtering toggle

### 3. Download Management
**What it does**: Handles downloads with progress tracking and database persistence

**Core Implementation**:
```typescript
// src/store/downloadStore.ts - downloadHandler()
downloadHandler: async (formatString: string, videoUrl: string, videoTitle: string) => {
  const uniqueId = nanoid(20);
  const bestVideoDownloadCommand = Command.sidecar("bin/yt-dlp", [
    "-f", formatString,
    "-o", `${videoDirectory}/OSDownloader/%(title)s${formatString}.%(ext)s`,
    `${videoUrl}`
  ]);
  
  await db.execute(`INSERT INTO DownloadList (
    id, unique_id, active, failed, completed, format_id, web_url, title, tracking_message
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
    mainId, uniqueId, true, false, false, formatString, videoUrl, videoTitle, "Retrieving download info"
  ]);
  
  bestVideoDownloadCommand.stdout.on("data", async (data) => {
    await db.execute(`UPDATE DownloadList SET tracking_message = $1 WHERE unique_id = $2`, 
      [data.toString().trim(), uniqueId]);
  });
}
```

**Features**:
- Real-time progress tracking through stdout parsing
- SQLite persistence with status tracking
- Unique ID generation for download identification
- Automatic retry/restart capability
- Individual download deletion

### 4. Playlist Processing
**What it does**: Extracts playlist information and enables selective video downloading

**Core Implementation**:
```typescript
// src/store/HeavyPlaylistStore.ts - fetchHeavyPlaylistInformation()
const command = Command.sidecar("bin/yt-dlp", [
  "--flat-playlist",
  "--dump-single-json", 
  "--yes-playlist",
  "--no-warnings",
  "--ignore-errors",
  playlistUrl
]);

lightPlaylistBatchDownload: async (fileArray: LightPlaylistEntry[], playlistTitle: string, fileFormat: LightPlaylistVideoQuality) => {
  await Promise.all(
    fileArray.map((file) =>
      lightPlaylistStore.lightPlaylistSingleDownloadHandler(
        file.title, file.url, playlistTitle, fileFormat
      )
    )
  );
}
```

**Features**:
- Lightweight playlist parsing with `--flat-playlist`
- Individual video selection from playlist
- Batch download with Promise.all coordination
- Playlist-specific folder organization
- Quality preset selection (720p, 1080p, etc.)

### 5. State Management Architecture
**What it does**: Coordinates multiple Zustand stores for different application concerns

**Store Structure**:
```typescript
// Specialized stores for different domains
export const useUserInputVideoStore = create<UserInputVideoStoreInterface>(...);  // Video handling
export const useHeavyPlaylistStore = create<HeavyPlaylistStoreInterface>(...);    // Playlist operations  
export const useDownloadStore = create<DownloadStoreInterface>(...);              // Download management
export const useDatabaseStore = create<DatabaseInterface>(...);                   // Database operations
export const useApplicationstore = create<ApplicationInterface>(...);             // App updates & metadata
export const useThemeStore = create<ThemeState>(...);                            // UI theming
```

**Cross-store Communication**:
```typescript
// Example: Video store coordinating with playlist store
const heavyPlaylistStore = useHeavyPlaylistStore.getState();
heavyPlaylistStore.setHeavyPlaylistFormatSectionVisible(false);
```

**Features**:
- Domain-separated concerns (video, playlist, downloads, database)
- Cross-store communication via getState()
- Reactive UI updates with Zustand selectors

### 6. Database Layer
**What it does**: SQLite integration for persistent download tracking

**Core Implementation**:
```typescript
// src/store/databaseStore.ts
createOrLoadDatabase: async () => {
  const db = await Database.load("sqlite:osdownloader.db");
  
  await db.execute(`CREATE TABLE IF NOT EXISTS DownloadList (
    id VARCHAR(255) PRIMARY KEY,
    unique_id VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT false,
    failed BOOLEAN NOT NULL DEFAULT false, 
    completed BOOLEAN NOT NULL DEFAULT false,
    isPaused BOOLEAN NOT NULL DEFAULT false,
    format_id VARCHAR(255) NOT NULL,
    web_url VARCHAR(255),
    title VARCHAR(255),
    tracking_message TEXT,
    playlistVerification TEXT,
    playlistTitle TEXT
  );`);
}
```

**Features**:
- Download history persistence
- Status tracking (active, failed, completed, paused)
- Individual file removal
- Bulk database clearing
- Playlist verification string for grouping

### 7. Desktop App Integration
**What it does**: Custom window controls and desktop-specific features

**Core Implementation**:
```typescript
// src/components/menuBar/MenuBar.tsx - Custom window controls
const handleWindowClose = async () => {
  const db = await Database.load("sqlite:osdownloader.db");
  await db.execute("UPDATE DownloadList SET active = false,isPaused = true");
  await getCurrentWindow().close();
};

// src/App.tsx - Context menu prevention
useEffect(() => {
  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
  };
  document.addEventListener("contextmenu", handleContextMenu);
}, []);
```

**Features**:
- Custom window controls (minimize, maximize, close)
- Transparent window with custom decorations
- Right-click context menu disabled
- Window dragging via custom drag area
- Fullscreen toggle functionality

### 8. Application Update System
**What it does**: Checks for app and yt-dlp updates from GitHub metadata

**Core Implementation**:
```typescript
// src/store/applicationStore.ts
fetchAppVersion: async () => {
  let currentVersion = await getVersion();
  let response = await fetch(applicationStore.metadataUrl);
  if (response.status === 200) {
    let data = await response.json() as MetadataInterface;
    if (localApplicationVersion < onlineApplicationVersion) {
      addToast({
        title: "Application Update Available",
        description: `Online: ${onlineApplicationVersion}, Local: ${localApplicationVersion}`,
        color: "warning",
      });
    }
  }
}
```

**Features**:
- Automatic update checking on startup  
- Version comparison for both app and yt-dlp
- Remote metadata fetching from GitHub
- Update notifications with download links
- Feature and bug fix changelog display

### 9. Clipboard Integration
**What it does**: Seamless clipboard operations for URLs

**Core Implementation**:
```typescript
// src/store/UserInputVideoStore.ts
clipboardReadingHandle: async () => {
  const content = await readText();
  await setVideoUrl(content);
  addToast({
    title: "Paste successful",
    description: "Successfully pasted the link!",
    color: "success",
  });
}
```

**Features**:
- One-click URL pasting from clipboard
- URL copying for sharing
- Input field clearing
- Toast notifications for feedback

### 10. Theme System
**What it does**: Dark/light mode with localStorage persistence

**Core Implementation**:
```typescript
// src/store/themeStore.ts
setThemeData: () => {
  const savedTheme = localStorage.getItem("theme") as LocalStorageThemeInterface;
  if (savedTheme === "dark") {
    setDark(true);
    document.documentElement.classList.add("dark");
  } else {
    setDark(false);
    document.documentElement.classList.remove("dark");
  }
}
```

**Features**:
- Toggle between dark and light themes
- localStorage persistence across sessions
- CSS class-based theme switching
- Tailwind CSS dark mode integration

---

## 🛠️ Technical Stack

**Frontend**: React 18, TypeScript, Tailwind CSS 3.4, HeroUI components  
**State Management**: Zustand (6 specialized stores)  
**Desktop Framework**: Tauri v2 with Rust backend  
**Database**: SQLite via Tauri SQL plugin  
**External Tools**: yt-dlp, ffmpeg suite (bundled as external binaries)  
**Build**: Vite, TypeScript compiler  
**Icons**: Lucide React, React Icons  

## 🚀 App Structure

```
src/
├── store/           # Zustand state management
├── components/      # React components by feature
│   ├── video/       # Single video handling
│   ├── playlist/    # Playlist operations  
│   ├── menuBar/     # Window controls & navigation
│   └── footer/      # Status information
├── interfaces/      # TypeScript type definitions
├── routes/          # React Router pages
└── ui/              # Reusable UI components

src-tauri/
├── bin/             # External executables (yt-dlp, ffmpeg)
├── src/             # Rust backend code
└── icons/           # Application icons
```

## 🔧 Development Features

- **Hot reload** during development with Vite
- **Type safety** with comprehensive TypeScript interfaces  
- **Error boundaries** with toast notifications
- **Responsive design** with Tailwind CSS
- **Component organization** by feature domain
- **Cross-platform compatibility** via Tauri

This project demonstrates practical desktop application development with modern web technologies, focusing on real-world concerns like state management, external process coordination, and user experience design.
