import { DownloadStoreInterface } from "@/interfaces/video/DownloadStore";
import { videoDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";
import { create } from "zustand";
import { nanoid } from "nanoid";
import Database from "@tauri-apps/plugin-sql";
import { useUserInputVideoStore } from "./UserInputVideoStore";
import { useUtilityStore } from "./UtilityStore";
import {
  failStatusObject,
  pauseStatus,
} from "@/interfaces/video/VideoInformation";
import { addToast } from "@heroui/react";

export const useDownloadStore = create<DownloadStoreInterface>((set, get) => ({
  selectedFormat: null,
  setSelectedFormat: (format: string | null) => set({ selectedFormat: format }),
  selectedAudioStream: null,
  setSelectedAudioStream: (format: string | null) =>
    set({ selectedAudioStream: format }),
  selectedVideoStream: null,
  setSelectedVideoStream: (format: string | null) =>
    set({ selectedVideoStream: format }),
  downloadHandler: async (
    formatString: string,
    videoUrl: string,
    videoTitle: string
  ) => {
    try {
      const videoDirectory = await videoDir();
      const now = new Date();
      const timestampMs = now.getTime();
      const uniqueId = nanoid(20);
      const mainId = timestampMs + nanoid(25);

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
        formatString,
        "-o",
        `${videoDirectory}/OSDownloader/%(title)s${formatString}.%(ext)s`,
        `${videoUrl}`,
      ]);

      await bestVideoDownloadCommand.spawn();

      await db.execute(
        `DELETE FROM DownloadList
   WHERE format_id = $1 AND web_url = $2`,
        [formatString.trim(), videoUrl]
      );

      await db.execute(
        `INSERT INTO DownloadList (
    id, unique_id, active, failed, completed, format_id, web_url, title, tracking_message,isPaused
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
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
  videoStreamSelect: (vst: string) => {
    const downloadStore = get();
    const selectedAudioStream = downloadStore.selectedAudioStream;
    const setSelectedFormat = downloadStore.setSelectedFormat;
    const setSelectedVideoStream = downloadStore.setSelectedVideoStream;
    try {
      setSelectedVideoStream(vst);
      if (selectedAudioStream) {
        let formatString = `${vst.trim()}+${selectedAudioStream.trim()}`.trim();
        setSelectedFormat(formatString);
      } else {
        setSelectedFormat(vst.trim());
      }
    } catch (error) {
      addToast({
        title: "Failed",
        description: "Video stream selection failed!",
        color: "warning",
        timeout: 1000,
      });
    }
  },
  audioStreamSelect: (ast: string) => {
    const downloadStore = get();
    const selectedVideoStream = downloadStore.selectedVideoStream;
    const setSelectedAudioStream = downloadStore.setSelectedAudioStream;
    const setSelectedFormat = downloadStore.setSelectedFormat;
    try {
      setSelectedAudioStream(ast.trim());
      if (selectedVideoStream) {
        let formatString = `${selectedVideoStream.trim()}+${ast.trim()}`.trim();
        setSelectedFormat(formatString);
      } else {
        // console.log("Video stream not founf");
        setSelectedFormat(ast.trim());
      }
    } catch (error) {
      addToast({
        title: "Failed",
        description: "Video stream selection failed!",
        color: "warning",
        timeout: 1000,
      });
    }
  },
}));
