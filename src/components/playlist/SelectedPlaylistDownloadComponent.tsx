import { LightPlaylistVideoQuality } from "@/interfaces/playlist/QualityEnums";
import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import { Button } from "@heroui/react";
import { Download } from "lucide-react";

export default function SelectedPlaylistDownloadComponent() {
  const heavyPlaylistInformation = useHeavyPlaylistStore(
    (state) => state.heavyPlaylistInformation
  );
  const lightPlaylistBatchDownload = useHeavyPlaylistStore(
    (state) => state.lightPlaylistBatchDownload
  );
  const modifiedLightEntriesArr = useHeavyPlaylistStore(
    (state) => state.modifiedLightEntriesArr
  );

  if (!modifiedLightEntriesArr) return;

  return (
    <div className="w-full  h-fit p-2 grid grid-cols-2 gap-2 shadow-md shadow-black rounded-md">
      <h1 className="font-bold text-3xl items-center flex p-2 gap-4 col-span-2">
          <Download />
          <span>Selected Videos</span>
          </h1>
      <Button
        color="success"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            modifiedLightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.BEST
          )
        }
      >
        <Download />
        Selected Playlist (Best Q.)
      </Button>
      <Button
        color="success"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            modifiedLightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX720P
          )
        }
      >
        <Download />
        Selected Playlist (Max-720p)
      </Button>
      <Button
        color="success"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            modifiedLightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX1080P
          )
        }
      >
        <Download />
        Selected Playlist (Max-1080p)
      </Button>
      <Button
        color="success"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            modifiedLightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX2K
          )
        }
      >
        <Download />
        Selected Playlist (Max-2K)
      </Button>
      <Button
        color="success"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            modifiedLightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX4K
          )
        }
      >
        <Download />
        Selected Playlist (Max-4K)
      </Button>
      <Button
        color="danger"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            modifiedLightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.AUDIOONLY
          )
        }
      >
        <Download />
        Audio (Selected Playlist)
      </Button>
    </div>
  );
}
