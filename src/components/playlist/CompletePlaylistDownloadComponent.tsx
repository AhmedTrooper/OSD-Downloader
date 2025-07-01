import { LightPlaylistVideoQuality } from "@/interfaces/playlist/QualityEnums";
import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import { Button } from "@heroui/react";
import { Download } from "lucide-react";

export default function CompletePlaylistDownloadComponent() {
  const heavyPlaylistInformation = useHeavyPlaylistStore(
    (state) => state.heavyPlaylistInformation
  );
  const lightPlaylistBatchDownload = useHeavyPlaylistStore(
    (state) => state.lightPlaylistBatchDownload
  );
  const lightEntriesArr = useHeavyPlaylistStore(
    (state) => state.lightEntriesArr
  );
  return (
    <div className="w-full h-fit p-2 grid grid-cols-2 gap-2 shadow-md shadow-black rounded-md">
      <h1 className="font-bold text-3xl items-center flex p-2 gap-4 col-span-2">
        <Download />
        <span>Complete Playlist</span>
      </h1>
      <Button
        color="primary"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            lightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.BEST
          )
        }
      >
        <Download />
        Complete Playlist (Best Q.)
      </Button>
      <Button
        color="primary"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            lightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX720P
          )
        }
      >
        <Download />
        Complete Playlist (Max-720p)
      </Button>
      <Button
        color="primary"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            lightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX1080P
          )
        }
      >
        <Download />
        Complete Playlist (Max-1080p)
      </Button>
      <Button
        color="primary"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            lightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX2K
          )
        }
      >
        <Download />
        Complete Playlist (Max-2K)
      </Button>
      <Button
        color="primary"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            lightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.MAX4K
          )
        }
      >
        <Download />
        Complete Playlist (Max-4K)
      </Button>
      <Button
        color="danger"
        className="flex"
        onPress={() =>
          lightPlaylistBatchDownload(
            lightEntriesArr,
            heavyPlaylistInformation?.title as string,
            LightPlaylistVideoQuality.AUDIOONLY
          )
        }
      >
        <Download />
        Audio (Complete Playlist)
      </Button>
    </div>
  );
}
