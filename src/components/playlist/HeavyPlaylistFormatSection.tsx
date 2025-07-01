import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import { Button } from "@heroui/react";
import {
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FilePlus2,
  List,
} from "lucide-react";
import OpenHeavyDialogSection from "../video/OpenHeavyDialogSection";
import { useUserInputVideoStore } from "@/store/UserInputVideoStore";
import CompletePlaylistDownloadComponent from "./CompletePlaylistDownloadComponent";
import SelectedPlaylistDownloadComponent from "./SelectedPlaylistDownloadComponent";
import SelectedLightEntries from "./SelectedLightEntries";
import { LightPlaylistVideoQuality } from "@/interfaces/playlist/QualityEnums";
import { isEmpty } from "lodash";
import { FaSadCry } from "react-icons/fa";

export default function HeavyPlaylistFormatSection() {
  const heavyPlaylistInformation = useHeavyPlaylistStore(
    (state) => state.heavyPlaylistInformation
  );
  const clipboardWritingHandle = useUserInputVideoStore(
    (state) => state.clipboardWritingHandle
  );

  const lightEntriesArr = useHeavyPlaylistStore(
    (state) => state.lightEntriesArr
  );
  const lightPlaylistSingleDownloadHandler = useHeavyPlaylistStore(
    (state) => state.lightPlaylistSingleDownloadHandler
  );

  const addItemsToLightModifiedEntriesArr = useHeavyPlaylistStore(
    (state) => state.addItemsToLightModifiedEntriesArr
  );

  if (!heavyPlaylistInformation) {
    return (
      <h1 className="flex font-bold items-center gap-4 text-zinc-600 p-2">
        <FaSadCry className="text-red-600" />
        <span>
          No playlist information is found.Check if url is of a playlist!
        </span>
      </h1>
    );
  }
  if (Array.isArray(heavyPlaylistInformation))
    return (
      <h1 className="flex font-bold items-center gap-4 text-zinc-600 p-2">
        <FaSadCry className="text-red-600" />
        <span>
          No playlist information is found.Check if url is of a playlist!
        </span>
      </h1>
    );
  if (!Array.isArray(heavyPlaylistInformation.entries))
    return (
      <h1 className="flex font-bold items-center gap-4 text-zinc-600 p-2">
        <FaSadCry className="text-red-600" />
        <span>
          No playlist information is found.Check if url is of a playlist!
        </span>
      </h1>
    );
  if (!Array.isArray(lightEntriesArr))
    return (
      <h1 className="flex font-bold items-center gap-4 text-zinc-600 p-2">
        <FaSadCry className="text-red-600" />
        <span>
          No playlist information is found.Check if url is of a playlist!
        </span>
      </h1>
    );
  return (
    <div className="rounded-lg shadow-md shadow-black m-2 p-4 overflow-auto custom-scrollbar max-h-[80vh] grid gap-4">
      <h1 className="w-full content-center items-center p-2 flex font-bold text-3xl">
        <ChevronRight />
        Playlist Information
      </h1>
      <header className="flex gap-4">
        <a
          target="_blank"
          href={heavyPlaylistInformation.webpage_url}
        >
          <ExternalLink />
        </a>
        <span>
          <Copy
            onClick={() =>
              clipboardWritingHandle(heavyPlaylistInformation.webpage_url)
            }
            className="text-blue-600 cursor-pointer"
          />
        </span>
        <h1>{heavyPlaylistInformation.title}</h1>
      </header>

      {!isEmpty(lightEntriesArr) && (
        <h1 className="w-fit items-center text-2xl gap-4 font-bold flex">
          <List />
          <span>Video List</span>
        </h1>
      )}

      <div className="grid gap-4">
        {lightEntriesArr.map((entry, index) => (
          <div
            key={index}
            className="shadow-lg shadow-black p-4 grid gap-4 rounded-lg"
          >
            <header className="grid gap-4">
              <h1>
                {++index + " -> "} {entry.title}
              </h1>
            </header>
            <div className="flex gap-4 p-2 max-w-full">
              <span>
                <Copy
                  onClick={() => clipboardWritingHandle(entry.url)}
                  className="text-blue-600 cursor-pointer"
                />
              </span>
              <a
                className="cursor-pointer"
                href={entry.url}
                target="_blank"
              >
                {entry.url}
              </a>
            </div>
            {/* Download Option..... */}
            <div className="grid grid-cols-3 gap-1">
              <Button
                className="flex max-w-full w-fit"
                onPress={() =>
                  lightPlaylistSingleDownloadHandler(
                    entry.title,
                    entry.url,
                    heavyPlaylistInformation.title,
                    LightPlaylistVideoQuality.BEST
                  )
                }
                color="warning"
              >
                <Download />
                Best Q.
              </Button>
              <Button
                className="flex max-w-full w-fit"
                onPress={() =>
                  lightPlaylistSingleDownloadHandler(
                    entry.title,
                    entry.url,
                    heavyPlaylistInformation.title,
                    LightPlaylistVideoQuality.MAX4K
                  )
                }
                color="success"
              >
                <Download />
                Max-4K/2160p
              </Button>

              <Button
                className="flex max-w-full w-fit"
                onPress={() =>
                  lightPlaylistSingleDownloadHandler(
                    entry.title,
                    entry.url,
                    heavyPlaylistInformation.title,
                    LightPlaylistVideoQuality.MAX2K
                  )
                }
                color="primary"
              >
                <Download />
                Max-2K/1440p
              </Button>

              <Button
                className="flex max-w-full w-fit"
                onPress={() =>
                  lightPlaylistSingleDownloadHandler(
                    entry.title,
                    entry.url,
                    heavyPlaylistInformation.title,
                    LightPlaylistVideoQuality.MAX1080P
                  )
                }
                color="primary"
              >
                <Download />
                Max-FHD/1080p
              </Button>

              <Button
                className="flex max-w-full w-fit"
                onPress={() =>
                  lightPlaylistSingleDownloadHandler(
                    entry.title,
                    entry.url,
                    heavyPlaylistInformation.title,
                    LightPlaylistVideoQuality.MAX720P
                  )
                }
                color="primary"
              >
                <Download />
                Max-HD/720
              </Button>
              <Button
                className=" max-w-full w-fit"
                onPress={() =>
                  lightPlaylistSingleDownloadHandler(
                    entry.title,
                    entry.url,
                    heavyPlaylistInformation.title,
                    LightPlaylistVideoQuality.AUDIOONLY
                  )
                }
                color="danger"
              >
                <Download />
                Audio (Max-best)
              </Button>
            </div>
            <Button
              className="flex"
              color="primary"
              onPress={() => addItemsToLightModifiedEntriesArr(entry)}
            >
              <FilePlus2 className="text-white cursor-pointer" />
              <span>Select</span>
            </Button>
          </div>
        ))}
      </div>

      <SelectedLightEntries />
      <SelectedPlaylistDownloadComponent />
      <CompletePlaylistDownloadComponent />

      <OpenHeavyDialogSection />
    </div>
  );
}
