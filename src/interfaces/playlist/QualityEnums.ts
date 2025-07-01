export enum LightPlaylistVideoQuality {
  BEST = "bestvideo+bestaudio",
  MAX720P = "bestvideo[height<=720]+bestaudio",
  MAX1080P = "bestvideo[height<=1080]+bestaudio",
  MAX2K = "bestvideo[height<=1440]+bestaudio",
  MAX4K = "bestvideo[height<=2160]+bestaudio",
  AUDIOONLY = "bestaudio",
}
