import {
  DownloadListInterface,
  SingleVideoTileInterface,
  VideoInformationInterface,
} from "./VideoInformation";

export interface UserInputVideoStoreInterface {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  fetchVideoInformation: () => void;
  videoInformationFetchFailed: boolean;
  setVideoInformationFetchFailed: (status: boolean) => void;
  readJsonFile: () => void;
  isLoadingForJsonCreation: boolean;
  setIsLoadingForJsonCreation: (s: boolean) => void;
  dialogSectionVisible: boolean;
  setDialogSectionVisible: (status: boolean) => void;
  formatSectionVisible: boolean;
  setFormatSectionVisible: (status: boolean) => void;
  videoInformation: VideoInformationInterface | null;
  setVideoInformation: (vio: VideoInformationInterface | null) => void;
  downloadsArr: DownloadListInterface;
  setDownloadsArr: (dArr: DownloadListInterface) => void;
  addVideoToDownloadsArr: (video: SingleVideoTileInterface) => void;
  showNonMedia: boolean;
  setShowNonMedia: (status: boolean) => void;
  clipboardReadingHandle: () => void;
  clipboardWritingHandle: (data: string | undefined) => void;
  handleClipboardClear: () => void;
  clearVideoInputField: () => void;
  downloadPlaylist: boolean;
  setDownloadPlaylist: (status: boolean) => void;
}
