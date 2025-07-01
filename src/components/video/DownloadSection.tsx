import { useUserInputVideoStore } from "@/store/UserInputVideoStore";
import { Button, Spinner } from "@heroui/react";
import { isEmpty } from "lodash";
import {
  BadgeX,
  ChevronRight,
  CirclePower,
  Copy,
  Play,
  ShieldCheck,
  Trash2Icon,
  Turtle,
} from "lucide-react";
import { clsx } from "clsx";
import { useUtilityStore } from "@/store/UtilityStore";
import { useDatabaseStore } from "@/store/databaseStore";
import { useDownloadStore } from "@/store/downloadStore";
import DownloadsHeader from "./DownloadsHeader";
import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import { LightPlaylistVideoQuality } from "@/interfaces/playlist/QualityEnums";

export default function DownloadSection() {
  const downloadsArr = useUserInputVideoStore((state) => state.downloadsArr);
  const parseBoolean = useUtilityStore((state) => state.parseBoolean);
  const singleFileRemove = useDatabaseStore((state) => state.singleFileRemove);
  const downloadHandler = useDownloadStore((state) => state.downloadHandler);
  const clipboardWritingHandle = useUserInputVideoStore(
    (state) => state.clipboardWritingHandle
  );
  const playlistVerificationString = useHeavyPlaylistStore(
    (state) => state.playlistVerificationString
  );
  const lightPlaylistSingleDownloadHandler = useHeavyPlaylistStore(
    (state) => state.lightPlaylistSingleDownloadHandler
  );

  return (
    <div className="mt-4  shadow-lg shadow-black h-[80vh] overflow-auto grid gap-4 custom-scrollbar rounded-md">
      {isEmpty(downloadsArr) && (
        <Turtle
          className="justify-self-center self-center text-4xl  text-zinc-500"
          width={100}
          height={100}
        />
      )}

      {/* Video Downloads List... */}

      {!isEmpty(downloadsArr) && (
        <div className="  rounded-md m-2  h-fit min-h-[80vh] ">
          <DownloadsHeader />
          {downloadsArr.map((video, index) => (
            <div
              key={index}
              className={clsx("m-2 shadow-md shadow-black p-2 rounded-md")}
            >
              <h1 className="text-blue-600 font-bold flex">
                <span>
                  <ChevronRight />
                </span>
                {video.title}
              </h1>
              <Button
                color="primary"
                className="m-1"
              >
                {video.format_id}
              </Button>
              <div className="flex gap-4 p-2 max-w-full">
                <span>
                  <Copy
                    onClick={() => clipboardWritingHandle(video.web_url!)}
                    className="text-blue-600 cursor-pointer"
                  />
                </span>
                {video.web_url}
              </div>

              {video.tracking_message && (
                <h1
                  className={clsx("max-w-full p-2", {
                    hidden: video.tracking_message.trim() === "falseFoundTrue",
                  })}
                >
                  {video.tracking_message}
                </h1>
              )}

              {!parseBoolean(video.failed) && parseBoolean(video.completed) && (
                <ShieldCheck className={clsx("text-green-600 m-2", {})} />
              )}

              {parseBoolean(video.failed) && parseBoolean(video.completed) && (
                <BadgeX className={clsx("text-red-600 m-2", {})} />
              )}

              {parseBoolean(video.active) && (
                <Spinner
                  color="white"
                  variant="spinner"
                  className="m-2"
                />
              )}

              {parseBoolean(video.isPaused) &&
                !parseBoolean(video.completed) && (
                  <Play className="m-2 cursor-pointer" />
                )}
              <div className=" gap-4 w-40 p-1  justify-items-end justify-center justify-self-center self-center grid grid-cols-2">
                <Trash2Icon
                  onClick={() => singleFileRemove(video.unique_id)}
                  className="cursor-pointer  active:scale-95 transition-transform duration-100 text-red-500"
                />

                {playlistVerificationString !== video.playlistVerification && (
                  <CirclePower
                    onClick={() =>
                      downloadHandler(
                        video.format_id,
                        video.web_url as string,
                        video.title as string
                      )
                    }
                    className="cursor-pointer  active:scale-95 transition-transform duration-100 text-green-600"
                  />
                )}

                {playlistVerificationString === video.playlistVerification && (
                  <CirclePower
                    onClick={() =>
                      lightPlaylistSingleDownloadHandler(
                        video.title as string,
                        video.web_url as string,
                        video.playlistTitle,
                        video.format_id as LightPlaylistVideoQuality
                      )
                    }
                    className="cursor-pointer  active:scale-95 transition-transform duration-100 text-blue-600"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Header section downloads.... */}

      {/* Modified Arrays...... */}
      {/* {modifiedDownloadsArr && !isEmpty(modifiedDownloadsArr) && (
        <div className="  rounded-md m-2  h-fit ">
          <h1>Modified download list</h1>
          <DownloadsHeader />
          {modifiedDownloadsArr.map((video, index) => (
            <div
              key={index}
              className={clsx("m-2 shadow-md shadow-black p-2 rounded-md")}
            >
              <h1 className="text-blue-600 font-bold flex">
                <span>
                  <ChevronRight />
                </span>
                {video.title}
              </h1>
              <Button
                color="primary"
                className="m-1"
              >
                {video.format_id}
              </Button>
              <div className="flex gap-4 p-2 max-w-full">
                <span>
                  <Copy
                    onClick={() => clipboardWritingHandle(video.web_url!)}
                    className="text-blue-600 cursor-pointer"
                  />
                </span>
                {video.web_url}
              </div>

              {video.tracking_message && (
                <h1
                  className={clsx("max-w-full p-2", {
                    hidden: video.tracking_message.trim() === "falseFoundTrue",
                  })}
                >
                  {video.tracking_message}
                </h1>
              )}

              {!parseBoolean(video.failed) && parseBoolean(video.completed) && (
                <ShieldCheck className={clsx("text-green-600 m-2", {})} />
              )}

              {parseBoolean(video.failed) && parseBoolean(video.completed) && (
                <BadgeX className={clsx("text-red-600 m-2", {})} />
              )}

              {parseBoolean(video.active) && (
                <Spinner
                  color="white"
                  variant="spinner"
                  className="m-2"
                />
              )}

              {parseBoolean(video.isPaused) &&
                !parseBoolean(video.completed) && (
                  <Play className="m-2 cursor-pointer" />
                )}
              <div className=" gap-4 w-40 p-1  justify-items-end justify-center justify-self-center self-center grid grid-cols-2">
                <Trash2Icon
                  onClick={() => singleFileRemove(video.unique_id)}
                  className="cursor-pointer  active:scale-95 transition-transform duration-100 text-red-500"
                />
                <CirclePower
                  onClick={() =>
                    downloadHandler(
                      video.format_id,
                      video.web_url as string,
                      video.title as string
                    )
                  }
                  className="cursor-pointer  active:scale-95 transition-transform duration-100 text-green-600"
                />
              </div>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
