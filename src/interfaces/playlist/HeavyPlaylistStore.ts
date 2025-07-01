import {
  HeavyPlaylistInformationInterface,
  LightPlaylistEntry,
} from "./PlaylistInformation";
import { LightPlaylistVideoQuality } from "./QualityEnums";

export interface HeavyPlaylistStoreInterface {
  playlistVerificationString: string;
  playlistUrl: string;
  setPlaylistUrl: (url: string) => void;
  playlistFetchFailed: boolean;
  setPlaylistFetchFailed: (status: boolean) => void;
  playlistFetchLoading: boolean;
  setPlaylistFetchLoading: (status: boolean) => void;
  readHeavyPlaylistJsonFile: () => Promise<null | undefined>;
  isLoadingForPlaylistJsonCreation: boolean;
  setIsLoadingForPlaylistJsonCreation: (s: boolean) => void;
  heavyPlaylistFormatSectionVisible: boolean;
  setHeavyPlaylistFormatSectionVisible: (status: boolean) => void;
  heavyPlaylistInformation: null | HeavyPlaylistInformationInterface;
  setHeavyPlaylistInformation: (
    vio: HeavyPlaylistInformationInterface | null
  ) => void;
  fetchHeavyPlaylistInformation: () => Promise<void>;
  lightEntriesArr: LightPlaylistEntry[];
  setLightEntriesArr: (arr: LightPlaylistEntry[]) => void;
  modifiedLightEntriesArr: null | LightPlaylistEntry[];
  setModifiedLightEntriesArr: (arr: LightPlaylistEntry[] | null) => void;
  addItemsToLightModifiedEntriesArr: (item: LightPlaylistEntry) => void;
  removeItemsFromLightModifiedEntriesArr: (item: LightPlaylistEntry) => void;
  lightPlaylistBatchDownload: (
    fileArray: LightPlaylistEntry[],
    playlistTitle: string,
    fileFormat: LightPlaylistVideoQuality
  ) => Promise<void>;
  lightPlaylistSingleDownloadHandler: (
    fileTitle: string,
    fileUrl: string,
    playlistTitle: string,
    fileFormat: LightPlaylistVideoQuality
  ) => void;
  clipboardReadingHandleForPlaylist: () => void;
  clipboardWritingHandleForPlaylist: (data: string | undefined) => void;
  clearVideoInputFieldForPlaylist: () => void;
}
