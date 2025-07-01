

import { MetadataInterface } from "./Metadata";

export interface ApplicationInterface {
  metadataUrl: string;
  appVersion: string | null;
  setAppVersion: (v: string | null) => void;
  onlineApplicationVersion: string | null;
  setOnlineApplicationVersion: (ov: string | null) => void;
  isApplicationUpdateAvailable: boolean;
  setIsApplicationUpdateAvailable: (status: boolean) => void;
  fetchAppVersion: () => void;
  errorOccurredWhileApplicationUpdateCheck: boolean;
  setErrorOccurredWhileApplicationUpdateCheck: (status: boolean) => void;
  checkedForApplicationUpdate: boolean;
  setCheckedForApplicationUpdate: (s: boolean) => void;
  ytDlpVersion: string | null;
  setYtdlpVersion: (ytdlv: string | null) => void;
  onlineYtdlpVersion: string | null;
  setOnlineYtdlpversion: (onlineytdlpv: string | null) => void;
  fetchYtdlpVersion: () => void;
  checkedForYtdlpUpdate: boolean;
  setCheckedForYtdlpUpdate: (s: boolean) => void;
  errorOccurredWhileYtdlpUpdateCheck: boolean;
  setErrorOccurredWhileYtdlpUpdateCheck: (status: boolean) => void;
  applicationOnlineUrl: string;
  ytdlpOnlineUrl: string;
  metadataInformation: MetadataInterface | null;
  setMetadataInformation: (metadata: null | MetadataInterface) => void;
  isYtdlpUpdateAvailable: boolean;
  setIsYtdlpUpdateAvailable: (status: boolean) => void;
}
