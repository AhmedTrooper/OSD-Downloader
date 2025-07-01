import {
  ArrowLeft,
  ArrowRight,
  CircleFadingArrowUp,
  Maximize2,
  Minus,
  X,
} from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useState } from "react";
import ThemeToggleButton from "@/ui/ThemeToggleButton";
import { useNavigate } from "react-router-dom";
import Database from "@tauri-apps/plugin-sql";
import TrashComponent from "./TrashComponent";
import clsx from "clsx";
import DrawerComponent from "./DrawerComponent";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import TutorialSection from "./TutorialSection";
import { useApplicationstore } from "@/store/applicationStore";
import VersionComponent from "./VersionComponent";

export default function MenuBar() {
  const [isFullScreen, setIsFullScreen] = useState<boolean | null>(null);
  const isYtdlpUpdateAvailable = useApplicationstore(
    (state) => state.isYtdlpUpdateAvailable
  );
  const isApplicationUpdateAvailable = useApplicationstore(
    (state) => state.isApplicationUpdateAvailable
  );
  const navigate = useNavigate();
  const startDraggingWindow = async () => {
    await getCurrentWindow().startDragging();
  };
  const metadataInformation = useApplicationstore(
    (state) => state.metadataInformation
  );

  const hideWindow = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch (e) {
      console.log(e);
    }
  };

  const handleFullScreen = async () => {
    try {
      let screenStatus = await getCurrentWindow().isFullscreen();
      setIsFullScreen(screenStatus);
      console.log(screenStatus);
      if (isFullScreen) {
        await getCurrentWindow().setFullscreen(false);
        setIsFullScreen(false);
      } else {
        await getCurrentWindow().setFullscreen(true);
        setIsFullScreen(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleWindowClose = async () => {
    try {
      const db = await Database.load("sqlite:osdownloader.db");
      await db.execute(
        "UPDATE DownloadList SET active = false,isPaused = true"
      );
      await getCurrentWindow().close();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="menu-bar fixed z-50 top-0 grid left-0 grid-cols-12 w-full  bg-[#191f1f] dark:bg-zinc-900 ">
      <div className="flex window-control justify-center  items-center  gap-4 p-1 col-span-2  ">
        <X
          onClick={handleWindowClose}
          className="cursor-pointer w-5 text-white"
        />
        <Minus
          onClick={hideWindow}
          className="cursor-pointer w-5 text-white"
        />
        <Maximize2
          onClick={handleFullScreen}
          className="cursor-pointer w-5 text-white"
        />
      </div>
      {/* bg-[#191f1f] dark:bg-zinc-900 */}
      <ul className="window-drag-area col-span-8 grid items-center w-full   grid-cols-12 ">
        {/* Dragging window section.... */}
        <li
          className="col-span-4  w-full h-full cursor-grabbing"
          onMouseDown={startDraggingWindow}
        ></li>

        {/* Navigation section.... */}
        <li className="grid grid-cols-2 w-fit col-span-4 gap-5 md:gap-15 lg:gap-24 cursor-pointer justify-items-center content-center text-white">
          <p onClick={() => navigate(-1)}>
            <ArrowLeft />
          </p>
          <p onClick={() => navigate(1)}>
            {" "}
            <ArrowRight />
          </p>
        </li>

        <li className={clsx("cursor-pointer col-span-1", {})}>
          <DrawerComponent />
        </li>

        <li className="col-span-1">
          {/* <Popover>
            <PopoverTrigger>
              <CircleDotDashed
                className={clsx("cursor-pointer text-green-600", {})}
              />
            </PopoverTrigger>
            <PopoverContent>
              <h1>You are using latest yt-dlp</h1>
            </PopoverContent>
          </Popover> */}
          <Popover>
            <PopoverTrigger>
              <p>
                {" "}
                <CircleFadingArrowUp
                  className={clsx("cursor-pointer", {
                    "text-red-600":
                      isApplicationUpdateAvailable || isYtdlpUpdateAvailable,
                    "text-green-600":
                      !isApplicationUpdateAvailable && !isYtdlpUpdateAvailable,
                  })}
                />
              </p>
            </PopoverTrigger>
            <PopoverContent className="p-2">
              {!metadataInformation && <span>Trying to get meta data...</span>}
              {metadataInformation && <VersionComponent />}
            </PopoverContent>
          </Popover>
        </li>

        <li className="w-full col-span-2 pr-3 grid items-center justify-items-center">
          <ThemeToggleButton />
        </li>
      </ul>
      <TrashComponent />
      <TutorialSection />
    </div>
  );
}
