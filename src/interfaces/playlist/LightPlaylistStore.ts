import { LightPlaylistInformationInterface } from "./PlaylistInformation";

export interface LightPlaylistStoreInterface {
  readLightPlaylistJsonFile: () => Promise<null | undefined>;
  isLoadingForPlaylistJsonCreation: boolean;
  setIsLoadingForPlaylistJsonCreation: (s: boolean) => void;
  lightPlaylistFormatSectionVisible: boolean;
  setLightPlaylistFormatSectionVisible: (status: boolean) => void;
  lightPlaylistInformation: LightPlaylistInformationInterface | null;
  setLightPlaylistInformation: (
    vio: LightPlaylistInformationInterface | null
  ) => void;
  fetchLightPlaylistInformation: () => Promise<void>;
}
