import { DownloadListInterface } from "./VideoInformation";

export interface VideoUtilityInterface {
  modifiedDownloadsArr: null | DownloadListInterface;
  setModifiedDownloadsArr:(arr :  null | DownloadListInterface)=>void;
  sortDownloadsArr: (sorts: TitleSort) => void;
  filterDownloadsArr: (filters: DownloadsFilter) => void;
}

export enum TitleSort {
  titleAsc,
  titleDesc,
}

export enum DownloadsFilter {
  Completed,
  Active,
  Failed,
  Paused,
}
