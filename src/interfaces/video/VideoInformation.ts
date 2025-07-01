export interface VideoInformationInterface {
  format_id?: string | null;
  format?: string | null;
  title?: string | null;
  webpage_url?: string | null;
  formats: FormatInterface[];
}

export interface FormatInterface {
  duration_string?: string | null;
  ext?: string | null;
  format_id: string | null;
  acodec?: string | "none" | null;
  vcodec?: string | "none" | null;
  audio_ext?: string | "none" | null;
  video_ext?: string | "none";
  resolution?: string;
  filesize_approx?: number | null;
  format?: string;
}

export interface SingleVideoTileInterface {
  id?: number | string;
  unique_id: string;
  active: boolean;
  failed: boolean;
  completed: boolean;
  format_id: string;
  web_url?: string | null;
  title: string | null;
  tracking_message: string;
  isPaused: pauseStatus;
  playlistVerification: string;
  playlistTitle: string;
}

export type pauseStatus = boolean | 0 | "0" | "1" | 1 | "true" | "false";

export type DownloadListInterface = SingleVideoTileInterface[];
export interface failStatusObject {
  failed: pauseStatus;
}
