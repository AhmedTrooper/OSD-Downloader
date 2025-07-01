import { useEffect } from "react";
import "./App.css";
import MenuBar from "./components/menuBar/MenuBar";
import useThemeStore from "./store/themeStore";
import { Outlet } from "react-router-dom";
import useOsInfoStore from "./store/osInfoStore";

import { useApplicationstore } from "./store/applicationStore";
import { useDatabaseStore } from "./store/databaseStore";

function App() {
  const dark = useThemeStore((state) => state.dark);
  const setDark = useThemeStore((state) => state.setDark);
  const detectOS = useOsInfoStore((state) => state.detectMobileOS);
  const isMobileOS = useOsInfoStore((state) => state.isMobileOS);
  const checkedForApplicationUpdate = useApplicationstore(
    (state) => state.checkedForApplicationUpdate
  );
  const fetchAppVersion = useApplicationstore((state) => state.fetchAppVersion);

  const setThemeData = useThemeStore((state) => state.setThemeData);

  const createOrLoadDatabase = useDatabaseStore(
    (state) => state.createOrLoadDatabase
  );
  const setDatabaseLoaded = useDatabaseStore(
    (state) => state.setDatabaseLoaded
  );
  const databaseLoaded = useDatabaseStore((state) => state.databaseLoaded);

  useEffect(() => {
    detectOS();
  }, []);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (!databaseLoaded) {
      createOrLoadDatabase();
      setDatabaseLoaded(true);
    }
  }, [databaseLoaded]);

  useEffect(() => {
    setThemeData();
  }, [setDark]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    if (!checkedForApplicationUpdate) fetchAppVersion();
  }, []);

  return (
    <div className="flex flex-col select-none max-h-[100vh]  bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors pt-10 overflow-auto custom-scrollbar">
      {!isMobileOS && <MenuBar />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
