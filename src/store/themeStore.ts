import { LocalStorageThemeInterface } from "@/interfaces/theme/LocalStorageTheme";
import { create } from "zustand";

interface ThemeState {
  dark: boolean;
  setDark: (value: boolean) => void;
  toggleDark: () => void;
  setThemeData: () => void;
  savedTheme: null | "dark" | "light";
}

const useThemeStore = create<ThemeState>((set, get) => ({
  dark: true,
  savedTheme: localStorage.getItem("theme") as LocalStorageThemeInterface,
  setDark: (value) => set({ dark: value }),
  toggleDark: () => set((state) => ({ dark: !state.dark })),
  setThemeData: () => {
    const themeStore = get();
    const setDark = themeStore.setDark;
    const savedTheme = themeStore.savedTheme;
    try {
      if (savedTheme) {
        if (savedTheme === "dark") {
          setDark(true);
          localStorage.setItem("theme", "dark");
        } else {
          setDark(false);
          localStorage.setItem("theme", "light");
        }
      } else {
        localStorage.setItem("theme", "dark");
      }
    } catch (error) {
      // console.log(error);
    }
  },
}));

export default useThemeStore;
