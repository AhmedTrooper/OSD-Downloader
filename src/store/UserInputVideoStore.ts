import { UserInputVideoStoreInterface } from "@/interfaces/video/UserInputVideoStore";
import { Command } from "@tauri-apps/plugin-shell";
import { create } from "zustand";
import {
  BaseDirectory,
  mkdir,
  writeTextFile,
  readDir,
  readTextFile,
  exists,
} from "@tauri-apps/plugin-fs";
import { documentDir, join } from "@tauri-apps/api/path";
import { addToast } from "@heroui/react";
import {
  DownloadListInterface,
  SingleVideoTileInterface,
  VideoInformationInterface,
} from "@/interfaces/video/VideoInformation";
import {
  readText,
  writeText,
  clear,
} from "@tauri-apps/plugin-clipboard-manager";
import { useHeavyPlaylistStore } from "./HeavyPlaylistStore";
import { HeavyPlaylistInformationInterface } from "@/interfaces/playlist/PlaylistInformation";

export const useUserInputVideoStore = create<UserInputVideoStoreInterface>(
  (set, get) => ({
    downloadPlaylist: true,
    setDownloadPlaylist: (status: boolean) => set({ downloadPlaylist: status }),
    showNonMedia: false,
    setShowNonMedia: (status: boolean) => set({ showNonMedia: status }),
    videoInformation: null,
    setVideoInformation: (vio: VideoInformationInterface | null) =>
      set({ videoInformation: vio }),
    downloadsArr: [],
    setDownloadsArr: (dArr: DownloadListInterface) =>
      set({ downloadsArr: dArr }),
    setVideoInformationFetchFailed: (s: boolean) =>
      set({ videoInformationFetchFailed: s }),
    setVideoUrl: (url: string) => set({ videoUrl: url }),
    videoInformationFetchFailed: false,
    videoUrl: "",
    // fetchVideoInformation: async () => {
    //   const UserInputVideoStore = get();

    //   const videoUrl = UserInputVideoStore.videoUrl;
    //   const setIsLoadingForJsonCreation =
    //     UserInputVideoStore.setIsLoadingForJsonCreation;
    //   await setIsLoadingForJsonCreation(true);

    //   const setVideoInformationFetchFailed =
    //     UserInputVideoStore.setVideoInformationFetchFailed;
    //   setVideoInformationFetchFailed(false);

    //   const setDialogSectionVisible =
    //     UserInputVideoStore.setDialogSectionVisible;
    //   setDialogSectionVisible(false);
    //   UserInputVideoStore.setFormatSectionVisible(false);
    //   UserInputVideoStore.setVideoInformation(null);
    //   const documentFolder = await documentDir();
    //   const folderPath = await join(documentFolder, "OSDownloader");
    //   let noError = true;

    //   try {
    //     await readDir(folderPath); // throws if not exist
    //   } catch {
    //     await mkdir("OSDownloader", {
    //       baseDir: BaseDirectory.Document,
    //       recursive: true,
    //     });
    //   }

    //   const filePath = await join(folderPath, "video.json");

    //   let jsonOutput = "";
    //   // let jsonArray:any[] = [];
    //   const command = Command.sidecar("bin/yt-dlp", [
    //     "--dump-json",
    //     `${videoUrl.trim()}`,
    //   ]);

    //   //       const command = Command.sidecar("bin/yt-dlp", [
    //   //   "--dump-json",
    //   //   "--yes-playlist",
    //   //   "--no-warnings",
    //   //   "--ignore-errors",
    //   //   videoUrl
    //   // ]);

    //   try {
    //     command.spawn();
    //     command.stdout.on("data", (line) => {
    //       jsonOutput = line;
    //       // console.log(line);
    //       // jsonArray.push(JSON.parse(line));
    //     });
    //     command.stderr.on("data", (data) => {
    //       noError = false;
    //       addToast({
    //         title: "Error ocurred on Data Fetch",
    //         description: data,
    //         color: "danger",
    //         timeout: 2000,
    //       });
    //     });

    //     command.on("close", async () => {
    //       if (noError) {
    //         // console.log(await jsonArray);
    //         await writeTextFile(filePath, jsonOutput, {
    //           baseDir: BaseDirectory.Document,
    //         });
    //         const readJsonFile = get().readJsonFile;
    //         await readJsonFile();
    //       } else {
    //         setIsLoadingForJsonCreation(false);
    //         addToast({
    //           title: "Error ocurred on Data Fetch",
    //           description: "Unsafe json output!",
    //           color: "danger",
    //           timeout: 2000,
    //         });
    //       }
    //     });
    //   } catch (error) {
    //     addToast({
    //       title: "Error saving video info",
    //       description: "Hell",
    //       color: "danger",
    //       timeout: 2000,
    //     });
    //     console.error("❌ Error saving video info:", error);

    //     const UserInputVideoStore = get();
    //     const setVideoInformationFetchFailed =
    //       UserInputVideoStore.setVideoInformationFetchFailed;
    //     setVideoInformationFetchFailed(true);

    //     addToast({
    //       title: "Error saving video info",
    //       description: error as string,
    //       color: "danger",
    //       timeout: 2000,
    //     });
    //   }
    // },
    // readJsonFile: async () => {
    //   try {
    //     const documentFolder = await documentDir();
    //     const folderPath = await join(documentFolder, "OSDownloader");
    //     const filePath = await join(folderPath, "video.json");
    //     const fileExists = await exists(filePath);
    //     const userInputVideoStore = get();
    //     const setFormatSectionVisible =
    //       userInputVideoStore.setFormatSectionVisible;
    //     const setVideoInformation = userInputVideoStore.setVideoInformation;
    //     if (!fileExists) {
    //       addToast({
    //         title: "video.json not found",
    //         description: "video.json does not exist at : " + filePath,
    //         color: "danger",
    //         timeout: 2000,
    //       });
    //       return null;
    //     }

    //     const jsonString = await readTextFile(filePath);
    //     const jsonData = await JSON.parse(jsonString);
    //     setFormatSectionVisible(true);
    //     setVideoInformation(jsonData as VideoInformationInterface);
    //     console.log(await jsonData);
    //     // return jsonData;
    //   } catch (err) {
    //     const UserInputVideoStore = get();
    //     const setVideoInformationFetchFailed =
    //       UserInputVideoStore.setVideoInformationFetchFailed;
    //     setVideoInformationFetchFailed(true);
    //     console.error("Error reading video.json:", err);

    //     const setIsLoadingForJsonCreation =
    //       UserInputVideoStore.setIsLoadingForJsonCreation;

    //     setIsLoadingForJsonCreation(false);
    //   } finally {
    //     const UserInputVideoStore = get();

    //     const setIsLoadingForJsonCreation =
    //       UserInputVideoStore.setIsLoadingForJsonCreation;

    //     const videoInformationFetchFailed =
    //       UserInputVideoStore.videoInformationFetchFailed;

    //     if (!videoInformationFetchFailed) {
    //       UserInputVideoStore.setDialogSectionVisible(true);
    //       addToast({
    //         title: "Successfull",
    //         description: "Video successfully fetched!",
    //         color: "success",
    //         timeout: 2000,
    //       });
    //     } else {
    //       addToast({
    //         title: "Error",
    //         description:
    //           "Something went wrong,Video information fetching failed!",
    //         color: "danger",
    //         timeout: 2000,
    //       });
    //     }

    //     setIsLoadingForJsonCreation(false);
    //   }
    // },
    // isLoadingForJsonCreation: false,
    // setIsLoadingForJsonCreation: (s: boolean) =>
    //   set({ isLoadingForJsonCreation: s }),
    // dialogSectionVisible: false,
    // setDialogSectionVisible: (status: boolean) =>
    //   set({ dialogSectionVisible: status }),
    // formatSectionVisible: false,
    // setFormatSectionVisible: (status: boolean) =>
    //   set({ formatSectionVisible: status }),

    // addVideoToDownloadsArr: (video: SingleVideoTileInterface) => {
    //   const UserInputVideoStore = get();
    //   const downloadsArr = UserInputVideoStore.downloadsArr;
    //   const setDownloadsArr = UserInputVideoStore.setDownloadsArr;

    //   const singleVideo = video;
    //   let x = [...downloadsArr];

    //   try {
    //     x.push(singleVideo);
    //     setDownloadsArr(x);
    //   } catch (e) {
    //     console.log("Pushing to downloads array failed");
    //   }
    // },
    clipboardReadingHandle: async () => {
      const UserInputVideoStore = get();
      const setVideoUrl = UserInputVideoStore.setVideoUrl;

      try {
        const content = await readText();
        await setVideoUrl(content);
        addToast({
          title: "Paste successfull",
          description: "Successfully pasted the link!",
          color: "success",
          timeout: 1000,
        });
      } catch (err) {
        // console.log(err);
        addToast({
          title: "Paste failed",
          description: err as string,
          color: "warning",
          timeout: 1000,
        });
      }
    },
    clipboardWritingHandle: async (data: string | undefined) => {
      try {
        if (data) {
          await writeText(data.trim());

          addToast({
            title: "Copied",
            description: "File link is copied successsfully",
            color: "primary",
            timeout: 1000,
          });
        }
      } catch (err) {
        addToast({
          title: "Copy failed",
          description: err as string,
          color: "warning",
          timeout: 1000,
        });
      }
    },
    handleClipboardClear: async () => {
      try {
        await clear();
        addToast({
          title: "Cleard",
          description: "Input field cleard",
          color: "primary",
          timeout: 1000,
        });
      } catch (error) {
        // console.log(error);
        addToast({
          title: "Clear error",
          description: "Couln't clear clipboard",
          color: "warning",
          timeout: 1000,
        });
      }
    },
    clearVideoInputField: () => {
      let videoStore = get();
      videoStore.setVideoUrl("");
      // videoStore.handleClipboardClear();
    },
    fetchVideoInformation: async () => {
      const UserInputVideoStore = get();
      const heavyPlaylistStore = useHeavyPlaylistStore.getState();
      heavyPlaylistStore.setHeavyPlaylistFormatSectionVisible(false);
      // Extract needed store functions and values
      const videoUrl = UserInputVideoStore.videoUrl;
      const setIsLoadingForJsonCreation =
        UserInputVideoStore.setIsLoadingForJsonCreation;
      const setVideoInformationFetchFailed =
        UserInputVideoStore.setVideoInformationFetchFailed;
      const setDialogSectionVisible =
        UserInputVideoStore.setDialogSectionVisible;
      const downloadPlaylist = UserInputVideoStore.downloadPlaylist;
      const setDownloadPlaylist = UserInputVideoStore.setDownloadPlaylist;

      // Set initial loading state
      await setIsLoadingForJsonCreation(true);
      setVideoInformationFetchFailed(false);
      setDialogSectionVisible(false);
      UserInputVideoStore.setFormatSectionVisible(false);
      UserInputVideoStore.setVideoInformation(null);

      // Create output folder if not exists
      const documentFolder = await documentDir();
      const folderPath = await join(documentFolder, "OSDownloader");
      let noError = true;

      try {
        await readDir(folderPath); // throws if not exist
      } catch {
        await mkdir("OSDownloader", {
          baseDir: BaseDirectory.Document,
          recursive: true,
        });
      }

      const filePath = await join(folderPath, "video.json");
      let jsonOutput = "";

      //Command.....
      let command;
      //Create ytDlp command
      const videoCommand = Command.sidecar("bin/yt-dlp", [
        "--dump-json",
        `${videoUrl.trim()}`,
      ]);

      const playlistCommand = Command.sidecar("bin/yt-dlp", [
        "--flat-playlist",
        "--dump-single-json",
        "--yes-playlist",
        "--no-warnings",
        "--ignore-errors",
        `${videoUrl.trim()}`,
      ]);

      if (downloadPlaylist) {
        command = playlistCommand;
        setDownloadPlaylist(true);
        addToast({
          title: "Searching",
          description: "Started searching for information!",
          color: "primary",
          timeout: 500,
        });
      } else {
        command = videoCommand;
        setDownloadPlaylist(true);
        addToast({
          title: "Video Searching",
          description: "Started searching for video!",
          color: "primary",
          timeout: 500,
        });
      }

      // //Single json dump....
      // const command = Command.sidecar("bin/yt-dlp", [
      //   "--dump-single-json",
      //   `${videoUrl.trim()}`,
      // ]);

      // Optional alternative:
      // const command = Command.sidecar("bin/yt-dlp", [
      //   "--dump-json",
      //   "--yes-playlist",
      //   "--no-warnings",
      //   "--ignore-errors",
      //   videoUrl
      // ]);

      try {
        // Wrap spawn and events in a Promise to await until "close"
        await new Promise<void>((resolve) => {
          command.stdout.on("data", (line) => {
            jsonOutput = line;
            // console.log(`Line :`, line);
            // jsonArray.push(JSON.parse(line));
          });

          command.stderr.on("data", (data) => {
            noError = false;
            addToast({
              title: "Error occurred on Data Fetch",
              description: data,
              color: "danger",
              timeout: 2000,
            });
          });

          command.on("close", async () => {
            if (noError) {
              // Save the dumped JSON to file
              await writeTextFile(filePath, jsonOutput, {
                baseDir: BaseDirectory.Document,
              });

              // Read JSON into UI
              const readJsonFile = get().readJsonFile;
              await readJsonFile();
            } else {
              setIsLoadingForJsonCreation(false);
              addToast({
                title: "Error occurred on Data Fetch",
                description: "Unsafe JSON output!",
                color: "danger",
                timeout: 2000,
              });
            }
            resolve();
          });

          command.spawn(); // Start command
        });
      } catch (error) {
        // Catch errors outside the command events
        addToast({
          title: "Error saving video info",
          description: "Hell",
          color: "danger",
          timeout: 2000,
        });
        console.error("❌ Error saving video info:", error);

        const UserInputVideoStore = get();
        const setVideoInformationFetchFailed =
          UserInputVideoStore.setVideoInformationFetchFailed;
        setVideoInformationFetchFailed(true);

        addToast({
          title: "Error saving video info",
          description: error as string,
          color: "danger",
          timeout: 2000,
        });
      }
    },
    readJsonFile: async () => {
      try {
        const documentFolder = await documentDir();
        const folderPath = await join(documentFolder, "OSDownloader");
        const filePath = await join(folderPath, "video.json");
        const heavyPlaylistStore = useHeavyPlaylistStore.getState();

        const fileExists = await exists(filePath);
        const userInputVideoStore = get();

        const setFormatSectionVisible =
          userInputVideoStore.setFormatSectionVisible;
        const setVideoInformation = userInputVideoStore.setVideoInformation;

        if (!fileExists) {
          addToast({
            title: "video.json not found",
            description: "video.json does not exist at: " + filePath,
            color: "danger",
            timeout: 2000,
          });
          return null;
        }

        const jsonString = await readTextFile(filePath);
        const jsonData = JSON.parse(jsonString);

        if (jsonData["entries"] && Array.isArray(jsonData["entries"])) {
          heavyPlaylistStore.setHeavyPlaylistFormatSectionVisible(true);
          heavyPlaylistStore.setHeavyPlaylistInformation(
            jsonData as HeavyPlaylistInformationInterface
          );
          heavyPlaylistStore.setLightEntriesArr(jsonData.entries);
        } else if (jsonData["formats"] && Array.isArray(jsonData["formats"])) {
          setFormatSectionVisible(true);
          setVideoInformation(jsonData as VideoInformationInterface);
        } else {
          setFormatSectionVisible(false);
          heavyPlaylistStore.setHeavyPlaylistFormatSectionVisible(false);
          addToast({
            title: "No Data Found",
            description: "Make sure you entered the correct url!",
            color: "warning",
            timeout: 1000,
          });
        }

        // console.log(jsonData);
      } catch (err) {
        const userInputVideoStore = get();
        const setVideoInformationFetchFailed =
          userInputVideoStore.setVideoInformationFetchFailed;
        const setIsLoadingForJsonCreation =
          userInputVideoStore.setIsLoadingForJsonCreation;

        setVideoInformationFetchFailed(true);
        setIsLoadingForJsonCreation(false);

        // console.error("Error reading video.json:", err);
        addToast({
          title: "Error reading video.json",
          description: err as string,
          color: "danger",
          timeout: 1000,
        });
      } finally {
        const userInputVideoStore = get();

        const setIsLoadingForJsonCreation =
          userInputVideoStore.setIsLoadingForJsonCreation;
        const videoInformationFetchFailed =
          userInputVideoStore.videoInformationFetchFailed;

        if (!videoInformationFetchFailed) {
          userInputVideoStore.setDialogSectionVisible(true);
          addToast({
            title: "Successful",
            description: "Video successfully fetched!",
            color: "success",
            timeout: 1000,
          });
        } else {
          addToast({
            title: "Error",
            description:
              "Something went wrong, video information fetching failed!",
            color: "danger",
            timeout: 2000,
          });
        }

        setIsLoadingForJsonCreation(false);
      }
    },

    // State setters
    isLoadingForJsonCreation: false,
    setIsLoadingForJsonCreation: (s: boolean) =>
      set({ isLoadingForJsonCreation: s }),

    dialogSectionVisible: false,
    setDialogSectionVisible: (status: boolean) =>
      set({ dialogSectionVisible: status }),

    formatSectionVisible: false,
    setFormatSectionVisible: (status: boolean) =>
      set({ formatSectionVisible: status }),

    // Add video to downloads array
    addVideoToDownloadsArr: (video: SingleVideoTileInterface) => {
      const userInputVideoStore = get();
      const downloadsArr = userInputVideoStore.downloadsArr;
      const setDownloadsArr = userInputVideoStore.setDownloadsArr;

      try {
        const updatedArr = [...downloadsArr, video];
        setDownloadsArr(updatedArr);
      } catch (e) {
        // console.log("Pushing to downloads array failed", e);
      }
    },
  })
);
