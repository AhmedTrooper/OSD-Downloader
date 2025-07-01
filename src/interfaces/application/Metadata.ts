export interface MetadataInterface {
  onlineApplicationVersion: string;
  release_date: string;
  features: string[];
  fixed_errors: string[];
  notes: string;
  release_url: string;
  author: string;
  severity: "low" | "medium" | "high";
  platforms: string[];
  onlineYtDlpVersion: string;
  ytdlpUrl: string;
}
