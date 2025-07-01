import { create } from "zustand";

import { addToast } from "@heroui/react";
import { useUserInputVideoStore } from "@/store/UserInputVideoStore";
import {
  BaseDirectory,
  documentDir,
  join,
  videoDir,
} from "@tauri-apps/api/path";
import {
  exists,
  mkdir,
  readDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { Command } from "@tauri-apps/plugin-shell";
import { HeavyPlaylistStoreInterface } from "@/interfaces/playlist/HeavyPlaylistStore";
import {
  HeavyPlaylistInformationInterface,
  LightPlaylistEntry,
} from "@/interfaces/playlist/PlaylistInformation";
import { isEmpty } from "lodash";
import { LightPlaylistVideoQuality } from "@/interfaces/playlist/QualityEnums";
import { nanoid } from "nanoid";
import { useUtilityStore } from "./UtilityStore";
import Database from "@tauri-apps/plugin-sql";
import {
  failStatusObject,
  pauseStatus,
} from "@/interfaces/video/VideoInformation";
import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";

export const useHeavyPlaylistStore = create<HeavyPlaylistStoreInterface>(
  (set, get) => ({
    playlistVerificationString:
      "ee02e844-f476-444f-86ae-ebe482ec350e-9ce65990-0035-487e-b523-9527d6471457-162336da-9301-4a97-9267-548752f4472f",

    playlistUrl: "",
    playlistFetchFailed: false,
    heavyPlaylistFormatSectionVisible: false,
    setHeavyPlaylistFormatSectionVisible: (status: boolean) =>
      set({ heavyPlaylistFormatSectionVisible: status }),

    setPlaylistUrl: (url: string) => set({ playlistUrl: url }),
    setPlaylistFetchFailed: (status: boolean) =>
      set({ playlistFetchFailed: status }),
    playlistFetchLoading: false,
    setPlaylistFetchLoading: (status: boolean) =>
      set({ playlistFetchLoading: status }),
    isLoadingForPlaylistJsonCreation: false,
    setIsLoadingForPlaylistJsonCreation: (s: boolean) =>
      set({ isLoadingForPlaylistJsonCreation: s }),

    fetchHeavyPlaylistInformation: async () => {
      // console.log("Playlist information fetch true");
      const playlistStore = get();
      const userInputVideoStore = useUserInputVideoStore.getState();
      playlistStore.setHeavyPlaylistInformation(null);
      playlistStore.setLightEntriesArr([]);
      playlistStore.setModifiedLightEntriesArr(null);

      // Extract needed store functions and values
      const playlistUrl = playlistStore.playlistUrl;
      const setIsLoadingForJsonCreation =
        playlistStore.setIsLoadingForPlaylistJsonCreation;
      const setVideoInformationFetchFailed =
        playlistStore.setPlaylistFetchFailed;
      const setDialogSectionVisible =
        userInputVideoStore.setDialogSectionVisible;
      const setPlaylistFetchLoading = playlistStore.setPlaylistFetchLoading;
      setPlaylistFetchLoading(true);
      userInputVideoStore.setFormatSectionVisible(false);

      // Set initial loading state
      setIsLoadingForJsonCreation(true);
      setVideoInformationFetchFailed(false);
      setDialogSectionVisible(false);
      playlistStore.setHeavyPlaylistFormatSectionVisible(false);
      // playlistStore.setVideoInformation(null);

      // Create output folder if not exists
      const documentFolder = await documentDir();
      const folderPath = await join(documentFolder, "OSDownloader");
      let noError = true;

      // console.log("Reached 1");

      try {
        await readDir(folderPath); // throws if not exist
        // console.log("Reached 2");
      } catch {
        await mkdir("OSDownloader", {
          baseDir: BaseDirectory.Document,
          recursive: true,
        });
        // console.log("Reached 3");
      }

      const filePath = await join(folderPath, "playlist.json");
      let jsonOutput = "";
      // console.log("Reached 4");

      // Create ytDlp command

      // const command = Command.sidecar("bin/yt-dlp", [
      //   "--dump-single-json",
      //   "--yes-playlist",
      //   "--no-warnings",
      //   "--ignore-errors",
      //   playlistUrl,
      // ]);

      const command = Command.sidecar("bin/yt-dlp", [
        "--flat-playlist",
        "--dump-single-json",
        "--yes-playlist",
        "--no-warnings",
        "--ignore-errors",
        playlistUrl,
      ]);

      try {
        // Wrap spawn and events in a Promise to await until "close"
        await new Promise<void>((resolve) => {
          command.stdout.on("data", (line) => {
            // console.log("Reached 67");
            jsonOutput += line;
            // console.log("Data is : ", line);
            // jsonArray.push(JSON.parse(line));
          });
          // console.log("Reached 5");

          command.stderr.on("data", (data) => {
            // console.log("Reached 6", data);
            noError = false;
            addToast({
              title: "Error occurred on Data Fetch",
              description: data,
              color: "danger",
              timeout: 2000,
            });
            setPlaylistFetchLoading(false);
          });

          command.on("close", async () => {
            // console.log("Reached 7");
            if (noError) {
              // console.log("Started json writing");
              // Save the dumped JSON to file
              await writeTextFile(filePath, jsonOutput, {
                baseDir: BaseDirectory.Document,
              });

              // console.log("Json is reading started ->->\n\n\n:", jsonOutput);

              // Read JSON into UI
              // console.log("Tyson 78");
              const readHeavyPlaylistJsonFile = get().readHeavyPlaylistJsonFile;
              await readHeavyPlaylistJsonFile();
              // console.log("Tyson 89");
            } else {
              // console.log("Reached 9");
              setIsLoadingForJsonCreation(false);
            }
            resolve();
          });

          command.spawn(); // Start command

          // console.log("Reached 10");
        });
        // console.log("Reached 11");
      } catch (error) {
        // console.log("Reached 12");
        // Catch errors outside the command events
        addToast({
          title: "Error saving video info",
          description: "Hell",
          color: "danger",
          timeout: 2000,
        });
        console.error("❌ Error saving video info:", error);

        const playlistStore = get();
        const setPlaylistFetchFailed = playlistStore.setPlaylistFetchFailed;
        setPlaylistFetchFailed(true);
        setPlaylistFetchLoading(false);

        addToast({
          title: "Error saving video info",
          description: error as string,
          color: "danger",
          timeout: 2000,
        });

        // console.log("Reached 31");
      }

      // return null;
    },
    readHeavyPlaylistJsonFile: async () => {
      const heavyPlaylistStore = get();
      const setHeavyPlaylistInformation =
        heavyPlaylistStore.setHeavyPlaylistInformation;
      const setPlaylistFetchLoading =
        heavyPlaylistStore.setPlaylistFetchLoading;
      try {
        // console.log("Reached 20");
        const documentFolder = await documentDir();
        const folderPath = await join(documentFolder, "OSDownloader");
        const filePath = await join(folderPath, "playlist.json");

        const fileExists = await exists(filePath);
        const playlistStore = get();

        const setHeavyPlaylistFormatSectionVisible =
          playlistStore.setHeavyPlaylistFormatSectionVisible;
        //   const setVideoInformation = playlistStore.setVideoInformation;

        if (!fileExists) {
          // console.log("Reached 21");
          addToast({
            title: "playlistMetaData.json not found",
            description: "playlistMetaData.json does not exist at: " + filePath,
            color: "danger",
            timeout: 2000,
          });
          setPlaylistFetchLoading(false);
          return null;
        }

        // console.log("Reached 21");

        const jsonString = await readTextFile(filePath);
        const jsonData = JSON.parse(
          jsonString
        ) as HeavyPlaylistInformationInterface;
        setHeavyPlaylistInformation(jsonData);
        setHeavyPlaylistFormatSectionVisible(true);
        heavyPlaylistStore.setLightEntriesArr(jsonData.entries);
        //   setVideoInformation(jsonData as VideoInformationInterface);
        // console.log("Reached 22");

        // console.log("Json is reading started ->->\n\n\n:", jsonData);
      } catch (err) {
        // console.log("Reached 23");
        const playlistStore = get();
        const setPlaylistFetchFailed = playlistStore.setPlaylistFetchFailed;
        const setIsLoadingForPlaylistJsonCreation =
          playlistStore.setIsLoadingForPlaylistJsonCreation;

        setPlaylistFetchFailed(true);
        setIsLoadingForPlaylistJsonCreation(false);

        // console.error("Error reading video.json:", err);
        addToast({
          title: "Error reading video.json",
          description: err as string,
          color: "danger",
          timeout: 1000,
        });
        setPlaylistFetchLoading(false);
        // console.log("Reached 24");
      } finally {
        // console.log("Reached 25");
        const playlistStore = get();
        const userInputVideoStore = useUserInputVideoStore.getState();

        const setIsLoadingForJsonCreation =
          playlistStore.setIsLoadingForPlaylistJsonCreation;
        const videoInformationFetchFailed = playlistStore.playlistFetchFailed;

        if (!videoInformationFetchFailed) {
          // console.log("Reached 26");
          userInputVideoStore.setDialogSectionVisible(true);
          addToast({
            title: "Successful",
            description: "Video successfully fetched!",
            color: "success",
            timeout: 1000,
          });
        } else {
          // console.log("Reached 27");
          addToast({
            title: "Error",
            description:
              "Something went wrong, video information fetching failed!",
            color: "danger",
            timeout: 2000,
          });
        }

        // console.log("Reached 28");

        setIsLoadingForJsonCreation(false);
        playlistStore.setPlaylistFetchLoading(false);
      }

      // console.log("Reached 29");
    },
    heavyPlaylistInformation: null,
    setHeavyPlaylistInformation: (
      hPlaylistInfo: HeavyPlaylistInformationInterface | null
    ) => set({ heavyPlaylistInformation: hPlaylistInfo }),
    lightEntriesArr: [],
    setLightEntriesArr: (arr: LightPlaylistEntry[]) =>
      set({ lightEntriesArr: arr }),
    modifiedLightEntriesArr: null,
    setModifiedLightEntriesArr: (arr: LightPlaylistEntry[] | null) =>
      set({ modifiedLightEntriesArr: arr }),
    addItemsToLightModifiedEntriesArr: (item: LightPlaylistEntry) => {
      const heavyPlaylistStore = get();
      const setModifiedLightEntriesArr =
        heavyPlaylistStore.setModifiedLightEntriesArr;
      const modifiedLightEntriesArr =
        heavyPlaylistStore.modifiedLightEntriesArr;

      // Check if item already exists in the array (assuming unique 'id' property)
      const isItemPresent = modifiedLightEntriesArr?.some(
        (entry) => entry.url === item.url
      );

      if (!isItemPresent) {
        if (modifiedLightEntriesArr) {
          setModifiedLightEntriesArr([...modifiedLightEntriesArr, item]);
        } else {
          setModifiedLightEntriesArr([item]);
        }
        addToast({
          title: "Added",
          description: item.title,
          color: "success",
          timeout: 1000,
        });
      } else {
        addToast({
          title: "Already added",
          description: item.title,
          color: "success",
          timeout: 1000,
        });
      }
    },
    removeItemsFromLightModifiedEntriesArr: (item: LightPlaylistEntry) => {
      const heavyPlaylistStore = get();
      const setModifiedLightEntriesArr =
        heavyPlaylistStore.setModifiedLightEntriesArr;
      const modifiedLightEntriesArr =
        heavyPlaylistStore.modifiedLightEntriesArr;
      if (!modifiedLightEntriesArr) return;

      const tempArray = modifiedLightEntriesArr.filter(
        (entry) => entry.url !== item.url
      );
      if (isEmpty(tempArray)) {
        setModifiedLightEntriesArr(null);
      } else {
        setModifiedLightEntriesArr(tempArray);
      }

      addToast({
        title: "Removed",
        description: item.title,
        color: "warning",
        timeout: 1000,
      });
    },
    lightPlaylistSingleDownloadHandler: async (
      fileTitle: string,
      fileUrl: string,
      playlistTitle: string,
      fileFormat: LightPlaylistVideoQuality
    ) => {
      try {
        const heavyPlaylistStore = get();
        const playlistVerificationString =
          heavyPlaylistStore.playlistVerificationString;
        const videoDirectory = await videoDir();
        const now = new Date();
        const timestampMs = now.getTime();
        const uniqueId = nanoid(20);
        const mainId = timestampMs + nanoid(25);
        let formatString = fileFormat;
        let videoUrl = fileUrl;
        let videoTitle = fileTitle;

        const userInputVideoStore = useUserInputVideoStore.getState();
        const setDownloadsArr = userInputVideoStore.setDownloadsArr;
        const utilityStore = useUtilityStore.getState();
        const parseBoolean = utilityStore.parseBoolean;

        const db = await Database.load("sqlite:osdownloader.db");
        addToast({
          title: "Added",
          description: "File added to download list",
          color: "success",
          timeout: 400,
        });
        const bestVideoDownloadCommand = Command.sidecar("bin/yt-dlp", [
          "-f",
          fileFormat,
          "-o",
          `${videoDirectory}/OSDownloader/${playlistTitle}/%(title)s${formatString}.%(ext)s`,
          `${fileUrl}`,
        ]);

        await bestVideoDownloadCommand.spawn();

        await db.execute(
          `DELETE FROM DownloadList
   WHERE format_id = $1 AND web_url = $2`,
          [fileFormat.trim(), fileUrl]
        );

        await db.execute(
          `INSERT INTO DownloadList (
    id, unique_id, active, failed, completed, format_id, web_url, title, tracking_message,isPaused,playlistVerification,playlistTitle
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            mainId,
            uniqueId,
            true,
            false,
            false,
            formatString,
            videoUrl,
            videoTitle,
            "Retrieving download info",
            false,
            playlistVerificationString,
            playlistTitle,
          ]
        );
        // setDownloadsArr(await db.select("SELECT * FROM DownloadList"));
        setDownloadsArr(
          await db.select("SELECT * FROM DownloadList ORDER BY id DESC")
        );

        // Data catching on spawn

        const errorHandler = async (data: string) => {
          // console.log("Error while downloading:", data);

          await db.execute(
            `UPDATE DownloadList
       SET failed = true,
             active = true,
            isPaused = true,
           tracking_message = $1
       WHERE unique_id = $2`,
            [data.toString().trim(), uniqueId]
          );
        };

        const dataHandler = async (data: string) => {
          // console.log(
          //   "\n\n\n\nStd data start\n\n\n",
          //   data,
          //   "\n\n\nstd end\n\n\n"
          // );

          //   // Remove the listener immediately
          //   console.log("Starting remove the listner");
          //  bestVideoDownloadCommand.stdout.removeListener("data", dataHandler);
          //   bestVideoDownloadCommand.stderr.removeListener("data", errorHandler);
          //   // console.log("\n".repeat(20), x, "\n".repeat(20));
          //   console.log("Done remove the listner");

          await db.execute(
            `UPDATE DownloadList
       SET failed = false,
           isPaused = false,
           active = true,
           tracking_message = $1
       WHERE unique_id = $2`,
            [data.toString().trim(), uniqueId]
          );
          setDownloadsArr(
            await db.select("SELECT * FROM DownloadList ORDER BY id DESC")
          );

          // console.log("Called even after listner gone");
        };

        bestVideoDownloadCommand.stdout.on("data", dataHandler);

        //   Command error

        bestVideoDownloadCommand.stderr.on("data", errorHandler);

        bestVideoDownloadCommand.on("close", async () => {
          // console.log("Command closed : -> ", data);

          //    await db.execute(
          //     `UPDATE DownloadList
          //  SET failed = true,
          //        active = true,
          //       isPaused = true,
          //      tracking_message = $1
          //  WHERE unique_id = $2`,
          //     [data.toString().trim(), uniqueId]
          //   );

          const result: failStatusObject[] = await db.select(
            "SELECT failed FROM DownloadList WHERE unique_id = $1",
            [uniqueId]
          );
          // console.log(result);

          const failedStatus = (await result[0]["failed"]) as pauseStatus;
          // console.log(failedStatus);
          let parsedFailedStatus = await parseBoolean(failedStatus);
          // console.log(pActive);
          if (parsedFailedStatus) {
            try {
              await db.execute(
                `UPDATE DownloadList
       SET  active = false,
            isPaused = false,
           tracking_message = "falseFoundTrue",
           completed = true
       WHERE unique_id = $1`,
                [uniqueId]
              );
              //setting tracking_message as "falseFoundTrue" string d and based on this, show or hide message box..😑
            } catch (error) {
              // console.log("Error is if", error);
              addToast({
                title: "SQL Failed",
                description: error as string,
                color: "success",
                timeout: 2000,
              });
            }

            await setDownloadsArr(
              await db.select("SELECT * FROM DownloadList ORDER BY id DESC")
            );
          } else {
            try {
              await db.execute(
                `UPDATE DownloadList
       SET  active = false,
            isPaused = false,
            completed = true,
           tracking_message = "falseFoundTrue"
       WHERE unique_id = $1`,
                [uniqueId]
              );

              //setting tracking_message as "falseFoundTrue" string d and based on this, show or hide message box..😑
            } catch (err) {
              addToast({
                title: "SQL Failed",
                description: err as string,
                color: "success",
                timeout: 2000,
              });
              // console.log("Error is else", err);
            }

            await setDownloadsArr(
              await db.select("SELECT * FROM DownloadList ORDER BY id DESC")
            );
          }
        });
        bestVideoDownloadCommand.on("error", () => {
          // console.log("Command Error : ---> ", data);
        });
      } catch (e) {
      } finally {
        // console.log("Command is finished!");
      }
    },
    lightPlaylistBatchDownload: async (
      fileArray: LightPlaylistEntry[],
      playlistTitle: string,
      fileFormat: LightPlaylistVideoQuality
    ) => {
      const lightPlaylistStore = get();
      // console.log("Batch started");
      try {
        await Promise.all(
          fileArray.map((file) =>
            lightPlaylistStore.lightPlaylistSingleDownloadHandler(
              file.title,
              file.url,
              playlistTitle,
              fileFormat
            )
          )
        );
        // console.log("Batch working");
      } catch (error) {
        addToast({
          title: "Batch failed",
          description: error as string,
          color: "success",
          timeout: 2000,
        });
      }
    },
    clipboardReadingHandleForPlaylist: async () => {
      let heavyPlalistStore = get();
      const setVideoUrl = heavyPlalistStore.setPlaylistUrl;

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
    clipboardWritingHandleForPlaylist: async (data: string | undefined) => {
      try {
        if (data) {
          await writeText(data.trim());

          addToast({
            title: "Copied",
            description: "Playlist URL is copied successsfully",
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
    clearVideoInputFieldForPlaylist: () => {
      let heavyPlalistStore = get();
      heavyPlalistStore.setPlaylistUrl("");
    },
  })
);
