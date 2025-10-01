# OSD Downloader

A desktop media downloader built to understand cross-platform development with Tauri, React state management patterns, and external process integration. This project demonstrates junior/mid-level implementation of complex async operations, multi-store state coordination, and CLI tool integration.

**Developer**: AhmedTrooper

---

## 🏗️ Feature Breakdown & Implementation

### 1. Video Information Fetching Module
**Responsibility**: AhmedTrooper  
**What it does**: Takes a video URL, spawns yt-dlp process to extract metadata and available formats

**Core Implementation**:
```typescript
// src/store/UserInputVideoStore.ts - fetchVideoInformation()
const command = Command.sidecar("bin/yt-dlp", [
  "--dump-json", 
  `${videoUrl.trim()}`
]);

await new Promise<void>((resolve) => {
  command.stdout.on("data", (line) => {
    jsonOutput = line; // Capture JSON metadata
  });
  
  command.on("close", async () => {
    if (noError) {
      await writeTextFile(filePath, jsonOutput, {
        baseDir: BaseDirectory.Document,
      });
      await readJsonFile(); // Parse and load into UI
    }
    resolve();
  });
  command.spawn();
});
```

**Key Learning**: Learned to coordinate async command execution with Promise wrappers and event listeners for real-time output capture.

### 2. Format Selection & Stream Management  
**Responsibility**: AhmedTrooper  
**What it does**: Displays available video/audio streams and handles user selection logic

**Core Implementation**:
```typescript
// src/store/downloadStore.ts - Stream selection logic
videoStreamSelect: (vst: string) => {
  const selectedAudioStream = downloadStore.selectedAudioStream;
  setSelectedVideoStream(vst);
  
  if (selectedAudioStream) {
    let formatString = `${vst.trim()}+${selectedAudioStream.trim()}`.trim();
    setSelectedFormat(formatString);
  }
},

audioStreamSelect: (ast: string) => {
  const selectedVideoStream = downloadStore.selectedVideoStream;  
  setSelectedAudioStream(ast);
  
  if (selectedVideoStream) {
    let formatString = `${selectedVideoStream.trim()}+${ast.trim()}`.trim();
    setSelectedFormat(formatString);
  }
}
```

**Key Learning**: Understanding how yt-dlp format specifiers work (`format_id1+format_id2` for combining streams) and implementing the selection UI logic.

### 3. Download Management System
**Responsibility**: AhmedTrooper  
**What it does**: Handles actual downloads with progress tracking and SQLite persistence

**Core Implementation**:
```typescript
// src/store/downloadStore.ts - downloadHandler()
downloadHandler: async (formatString: string, videoUrl: string, videoTitle: string) => {
  const uniqueId = nanoid(20);
  const mainId = timestampMs + nanoid(25);
  
  const bestVideoDownloadCommand = Command.sidecar("bin/yt-dlp", [
    "-f", formatString,
    "-o", `${videoDirectory}/OSDownloader/%(title)s${formatString}.%(ext)s`,
    `${videoUrl}`
  ]);
  
  // Insert into database before starting download
  await db.execute(`INSERT INTO DownloadList (
    id, unique_id, active, failed, completed, format_id, web_url, title, tracking_message
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
    mainId, uniqueId, true, false, false, formatString, videoUrl, videoTitle, "Retrieving download info"
  ]);
  
  await bestVideoDownloadCommand.spawn();
}
```

**Key Learning**: Managing database state before/during/after async operations and handling unique ID generation for download tracking.

### 4. Playlist Processing Module  
**Responsibility**: AhmedTrooper  
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

await new Promise<void>((resolve) => {
  command.stdout.on("data", (line) => {
    jsonOutput += line; // Accumulate playlist JSON
  });
  
  command.on("close", async () => {
    const parsedJson = JSON.parse(jsonOutput);
    if (parsedJson.entries && Array.isArray(parsedJson.entries)) {
      setHeavyPlaylistInformation(parsedJson);
      setLightEntriesArr(parsedJson.entries.map(entry => ({
        url: entry.url,
        title: entry.title
      })));
    }
    resolve();
  });
});
```

**Key Learning**: Understanding the difference between `--flat-playlist` (lightweight) vs full playlist extraction, and how to process array-based JSON responses.

### 5. State Management Architecture
**Responsibility**: AhmedTrooper  
**What it does**: Coordinates multiple Zustand stores for different app concerns

**Core Implementation**:
```typescript
// Multiple specialized stores instead of single global state
export const useUserInputVideoStore = create<UserInputVideoStoreInterface>((set, get) => ({
  videoUrl: "",
  videoInformation: null,
  downloadsArr: [],
  // ... video-specific state
}));

export const useHeavyPlaylistStore = create<HeavyPlaylistStoreInterface>((set, get) => ({
  playlistUrl: "",
  lightEntriesArr: [],
  heavyPlaylistInformation: null,
  // ... playlist-specific state  
}));

export const useDownloadStore = create<DownloadStoreInterface>((set, get) => ({
  selectedFormat: null,
  selectedAudioStream: null, 
  selectedVideoStream: null,
  // ... download-specific state
}));
```

**Cross-store communication**:
```typescript
// Example: Video store calling playlist store
const heavyPlaylistStore = useHeavyPlaylistStore.getState();
heavyPlaylistStore.setHeavyPlaylistFormatSectionVisible(false);
```

**Key Learning**: Learned that multiple specialized stores can be more maintainable than a single global state, especially for complex async operations with different concerns.

### 6. Database Layer (SQLite Integration)
**Responsibility**: AhmedTrooper  
**What it does**: Persists download history and application state

**Core Implementation**:
```typescript
// src/store/databaseStore.ts - Database initialization
createOrLoadDatabase: async () => {
  const db = await Database.load("sqlite:osdownloader.db");
  
  await db.execute(`CREATE TABLE IF NOT EXISTS DownloadList (
    id VARCHAR(255) PRIMARY KEY,
    unique_id VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT false,
    failed BOOLEAN NOT NULL DEFAULT false, 
    completed BOOLEAN NOT NULL DEFAULT false,
    format_id VARCHAR(255) NOT NULL,
    web_url VARCHAR(255),
    title VARCHAR(255),
    tracking_message TEXT,
    playlistVerification TEXT,
    playlistTitle TEXT
  );`);
  
  const allDownloads = await db.select("SELECT * FROM DownloadList");
  setDownloadsArr(allDownloads);
}
```

**Key Learning**: Understanding how to structure database schemas for download tracking and implementing CRUD operations with Tauri's SQL plugin.

### 7. UI Components & Conditional Rendering
**Responsibility**: AhmedTrooper  
**What it does**: Renders different UI sections based on application state

**Core Implementation**:
```tsx
// src/components/video/VideoContainer.tsx - Conditional component rendering
export default function VideoContainer() {
  const dialogSectionVisible = useUserInputVideoStore(state => state.dialogSectionVisible);
  const formatSectionVisible = useUserInputVideoStore(state => state.formatSectionVisible);
  const heavyPlaylistFormatSectionVisible = useHeavyPlaylistStore(
    state => state.heavyPlaylistFormatSectionVisible
  );

  return (
    <div className="video-container">
      <UserInputSection />
      {dialogSectionVisible && videoInformation && <OpenDialogSection />}
      {formatSectionVisible && <FormatSection />}
      {heavyPlaylistInformation && <OpenHeavyDialogSection/>}
      {heavyPlaylistFormatSectionVisible && <HeavyPlaylistFormatSection/>}
      <DownloadSection />
    </div>
  );
}
```

**Key Learning**: Managing complex conditional rendering based on multiple store states and understanding React component lifecycle in relation to async operations.

---

## 🛠️ Technical Architecture

**Frontend**: React 18 + TypeScript + HeroUI + Tailwind CSS  
**State Management**: Zustand (multiple specialized stores)  
**Desktop Framework**: Tauri v2 (Rust backend)  
**Database**: SQLite with Tauri SQL plugin  
**External Tools**: yt-dlp, ffmpeg suite (bundled binaries)  

## 🧠 Key Learning Outcomes

This project taught me:

1. **Async Process Management**: How to spawn external CLI tools and handle their stdout/stderr streams
2. **Complex State Coordination**: Managing multiple Zustand stores with cross-store communication
3. **Database Integration**: SQLite operations in desktop apps with proper error handling  
4. **TypeScript Interface Design**: Creating type-safe contracts between different app layers
5. **Tauri Plugin System**: Using filesystem, shell, clipboard, and SQL plugins effectively
6. **CLI Tool Integration**: Understanding yt-dlp's various output formats and options

The codebase demonstrates a junior/mid-level understanding of desktop app development patterns, async operation coordination, and state management in React applications.
