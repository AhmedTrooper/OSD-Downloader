import { UtilityStoreInterface } from "@/interfaces/utility/UtilityStore";
import { create } from "zustand";

export const useUtilityStore = create<UtilityStoreInterface>(() => ({
  parseBoolean: (value: boolean | 0 | "0" | "1" | 1 | "true" | "false") => {
    if (value === true || value === "true" || value === "1" || value === 1) {
      return true;
    } else {
      return false;
    }
  },
}));
