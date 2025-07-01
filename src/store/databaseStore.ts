import { DatabaseInterface } from "@/interfaces/database/Database";
import { create } from "zustand";
import { useUserInputVideoStore } from "./UserInputVideoStore";
import Database from "@tauri-apps/plugin-sql";
import { DownloadListInterface } from "@/interfaces/video/VideoInformation";
import { addToast } from "@heroui/react";

export const useDatabaseStore = create<DatabaseInterface>((set) => ({
  createOrLoadDatabase: async () => {
    const UserInputVideoStore = useUserInputVideoStore.getState();
    const setDownloadsArr = UserInputVideoStore.setDownloadsArr;
    try {
      const db = await Database.load("sqlite:osdownloader.db");

      //  await db.execute(`DROP TABLE IF EXISTS DownloadList;`);
      //  console.log("Table droped")

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

      const allDownloads = (await db.select(
        "SELECT * FROM DownloadList"
      )) as DownloadListInterface;

      // console.log(allDownloads);

      setDownloadsArr(await allDownloads);
    } catch (err) {
      addToast({
        title: "SQL Error",
        description: err as string,
        color: "danger",
        timeout: 1000,
      });
    }
  },
  databaseLoaded: false,
  setDatabaseLoaded: (status: boolean) => set({ databaseLoaded: status }),
  emptyDatabase: async () => {
    const UserInputVideoStore = useUserInputVideoStore.getState();
    const setDownloadsArr = UserInputVideoStore.setDownloadsArr;
    try {
      const db = await Database.load("sqlite:osdownloader.db");
      await db.execute("DELETE FROM DownloadList;");
      setDownloadsArr([]);
      addToast({
        title: "Successfull",
        description: "Download list is empty!",
        color: "success",
        timeout: 2000,
      });
    } catch (e) {
      // console.log("Error on Downloads clear", e);
      addToast({
        title: "Error",
        description: "Error on Downloads clear",
        color: "danger",
        timeout: 2000,
      });
    }
  },
  singleFileRemove: async (uniqueId: string) => {
    const db = await Database.load("sqlite:osdownloader.db");
    const UserInputVideoStore = useUserInputVideoStore.getState();
    const setDownloadsArr = UserInputVideoStore.setDownloadsArr;
    try {
      await db.execute("DELETE FROM DownloadList WHERE unique_id = $1", [
        uniqueId,
      ]);
      await setDownloadsArr(await db.select("SELECT * FROM DownloadList"));
    } catch (err) {
      addToast({
        title: "Error",
        description: "Single file remove failed",
        color: "danger",
        timeout: 2000,
      });
    }
  },
}));
