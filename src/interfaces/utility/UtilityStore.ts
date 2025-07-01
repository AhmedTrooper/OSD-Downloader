export interface UtilityStoreInterface {
  parseBoolean: (value: boolean | 0 | "0" | "1" | 1 | "true" | "false") => boolean;
}
