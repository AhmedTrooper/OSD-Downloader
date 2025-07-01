export interface HeavyPlaylistInformationInterface {
  channel: string;
  channel_url: string;
  uploader_url: string;
  webpage_url: string;
  entries: HeavyPlaylistEntry[];
  title: string;
}

export interface LightPlaylistInformationInterface {
  channel: string;
  channel_url: string;
  uploader_url: string;
  webpage_url: string;
  entries: LightPlaylistEntry[];
  title: string;
}

export interface LightPlaylistEntry {
  url: string;
  title: string;
}

export interface HeavyPlaylistEntry {
  url: string;
  title: string;
}
