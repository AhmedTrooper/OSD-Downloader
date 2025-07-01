import { ApplicationInterface } from "@/interfaces/application/ApplicationInterface";
import { create } from "zustand";
import { getVersion } from "@tauri-apps/api/app";
import { Command } from "@tauri-apps/plugin-shell";
import { MetadataInterface } from "@/interfaces/application/MetaData";
import { addToast } from "@heroui/react";

export const useApplicationstore = create<ApplicationInterface>((set, get) => ({
  isYtdlpUpdateAvailable: false,
  setIsYtdlpUpdateAvailable: (status: boolean) =>
    set({ isYtdlpUpdateAvailable: status }),
  metadataInformation: null,
  setMetadataInformation: (metadata: null | MetadataInterface) =>
    set({ metadataInformation: metadata }),
  metadataUrl:
    "https://raw.githubusercontent.com/AhmedTrooper/OSGUI/main/update/metadata.json",
  appVersion: null,
  setAppVersion: (v: string | null) => set({ appVersion: v }),
  onlineApplicationVersion: null,

  setOnlineApplicationVersion: (ov: string | null) =>
    set({ onlineApplicationVersion: ov }),
  isApplicationUpdateAvailable: false,
  setIsApplicationUpdateAvailable: (status: boolean) =>
    set({ isApplicationUpdateAvailable: status }),
  errorOccurredWhileApplicationUpdateCheck: false,
  setErrorOccurredWhileApplicationUpdateCheck: (status: boolean) =>
    set({ errorOccurredWhileApplicationUpdateCheck: status }),
  checkedForApplicationUpdate: false,
  setCheckedForApplicationUpdate: (s: boolean) =>
    set({ checkedForApplicationUpdate: s }),
  ytDlpVersion: null,
  setYtdlpVersion: (ytdlv: string | null) => set({ ytDlpVersion: ytdlv }),
  onlineYtdlpVersion: null,
  setOnlineYtdlpversion: (onlineytdlpv: string | null) =>
    set({ onlineYtdlpVersion: onlineytdlpv }),
  checkedForYtdlpUpdate: false,
  setCheckedForYtdlpUpdate: (s: boolean) => set({ checkedForYtdlpUpdate: s }),
  errorOccurredWhileYtdlpUpdateCheck: false,
  setErrorOccurredWhileYtdlpUpdateCheck: (status: boolean) =>
    set({ errorOccurredWhileYtdlpUpdateCheck: status }),
  fetchAppVersion: async () => {
    const applicationStore = get();
    let localApplicationVersion: string | null = null;
    let onlineApplicationVersion: string | null = null;
    try {
      let currentVersion = await getVersion();
      localApplicationVersion = currentVersion;
      applicationStore.setAppVersion(currentVersion);
      let response = await fetch(applicationStore.metadataUrl);
      if (response.status === 200) {
        let data = (await response.json()) as MetadataInterface;
        applicationStore.setMetadataInformation(data);
        applicationStore.setOnlineApplicationVersion(
          data.onlineApplicationVersion
        );
        onlineApplicationVersion = data.onlineApplicationVersion;
        if (localApplicationVersion < onlineApplicationVersion) {
          addToast({
            title: "Application Update Available",
            description: `Online : ${onlineApplicationVersion}, Local: ${localApplicationVersion}`,
            color: "warning",
            timeout: 1000,
          });
          applicationStore.setIsApplicationUpdateAvailable(true);
        }
      }

      applicationStore.fetchYtdlpVersion();
    } catch (error) {
      addToast({
        title: "Application Version fetching Error!",
        description: error as string,
        color: "danger",
        timeout: 1000,
      });
      applicationStore.setErrorOccurredWhileApplicationUpdateCheck(true);
    } finally {
      applicationStore.setCheckedForApplicationUpdate(true);
    }
  },
  fetchYtdlpVersion: async () => {
    const ApplicationStore = get();
    const setYtdlpVersion = ApplicationStore.setYtdlpVersion;
    ApplicationStore.setOnlineYtdlpversion;
    let localYtdlp: string | null = null;
    let onlineYtdlp: string | null = null;
    try {
      // console.log("Yt-dlp is started fetching!");
      const cmd = Command.sidecar("bin/yt-dlp", ["--version"]);
      const result = await cmd.execute();
      const response = await fetch(ApplicationStore.metadataUrl);
      // console.log(response);
      if (response.status === 200) {
        const data = (await response.json()) as MetadataInterface;
        // console.log(data);
        ApplicationStore.setMetadataInformation(data);
        ApplicationStore.setOnlineYtdlpversion(data.onlineYtDlpVersion);
        onlineYtdlp = data.onlineYtDlpVersion;
      }
      setYtdlpVersion(result.stdout.trim());
      localYtdlp = result.stdout.trim();
      ApplicationStore.setYtdlpVersion(result.stdout.trim());
    } catch (error) {
      addToast({
        title: "Yt-dlp check failed",
        description: error as string,
        color: "danger",
        timeout: 1000,
      });
    } finally {
      if (localYtdlp && onlineYtdlp && localYtdlp < onlineYtdlp) {
        ApplicationStore.setIsYtdlpUpdateAvailable(true);
        addToast({
          title: "Yt-dlp update available",
          description: `Online: ${onlineYtdlp}, Local: ${localYtdlp}`,
          color: "warning",
          timeout: 1000,
        });
      }
      ApplicationStore.setCheckedForYtdlpUpdate(true);
    }
  },
  applicationOnlineUrl: "",
  ytdlpOnlineUrl: "",
}));
