import { DownloadListInterface } from "@/interfaces/video/VideoInformation";
import {
  DownloadsFilter,
  TitleSort,
  VideoUtilityInterface,
} from "@/interfaces/video/VideoUtility";
import { addToast } from "@heroui/react";
import { create } from "zustand";
import { useUserInputVideoStore } from "./UserInputVideoStore";

export const useVideoUtility = create<VideoUtilityInterface>((set, get) => ({
  setModifiedDownloadsArr: (arr: null | DownloadListInterface) =>
    set({ modifiedDownloadsArr: arr }),
  filterDownloadsArr: (filters: DownloadsFilter) => {
    const userIntent = filters;
    // const userInputVideoStore = useUserInputVideoStore.getState();
    // const downloadsArr = userInputVideoStore.downloadsArr;
    // const setDownloadsArr = userInputVideoStore.setDownloadsArr;
    // let tempDownloadsArr = [...downloadsArr];

    try {
      switch (userIntent) {
        case DownloadsFilter.Active:
          break;
        case DownloadsFilter.Completed:
          break;
        case DownloadsFilter.Paused:
          break;
        case DownloadsFilter.Failed:
          break;
      }
    } catch (error) {
      addToast({
        title: "Filter failed",
        description: error as string,
        color: "warning",
        timeout: 1000,
      });
    }
  },
  modifiedDownloadsArr: null,
  sortDownloadsArr: (sorts: TitleSort) => {
    const userIntent = sorts;
    const userInputVideoStore = useUserInputVideoStore.getState();
    const videoUtility = get();
    const downloadsArr = userInputVideoStore.downloadsArr;
    const setModifiedDownloadsArr = videoUtility.setModifiedDownloadsArr;
    const setDownloadsArr = userInputVideoStore.setDownloadsArr;
    let tempDownloadsArr = [...downloadsArr];
    try {
      switch (userIntent) {
        case TitleSort.titleDesc:
          tempDownloadsArr = tempDownloadsArr.sort((a, b) => {
            const titleA = a.title?.toLowerCase() ?? "";
            const titleB = b.title?.toLowerCase() ?? "";
            if (titleA > titleB) return -1;
            if (titleA < titleB) return 1;
            return 0;
          });
          break;
        case TitleSort.titleAsc:
          tempDownloadsArr = tempDownloadsArr.sort((a, b) => {
            const titleA = a.title?.toLowerCase() ?? "";
            const titleB = b.title?.toLowerCase() ?? "";
            if (titleA < titleB) return -1;
            if (titleA > titleB) return 1;
            return 0;
          });
          break;
        default:
          addToast({
            title: "Sort Enum mis-matched!",
            description: "Sort not found in TitleSort enum!",
            color: "warning",
            timeout: 1000,
          });
      }

      setModifiedDownloadsArr(tempDownloadsArr);
      setDownloadsArr(tempDownloadsArr);
      addToast({
        title: "Sorted",
        description: `List is sorted by title ${
          sorts === TitleSort.titleAsc ? "ASC" : "DESC"
        }`,
        color: "success",
        timeout: 2000,
      });
    } catch (error) {
      addToast({
        title: "Sorting failed",
        description: error as string,
        color: "warning",
        timeout: 1000,
      });
    }
  },
}));
