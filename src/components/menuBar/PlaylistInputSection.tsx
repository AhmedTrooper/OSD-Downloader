import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";
import { Eraser, Clipboard } from "lucide-react";

export default function PlaylistInputSection() {
  const clipboardReadingHandleForPlaylist = useHeavyPlaylistStore(
    (state) => state.clipboardReadingHandleForPlaylist
  );

  const clearVideoInputFieldForPlaylist = useHeavyPlaylistStore(
    (state) => state.clearVideoInputFieldForPlaylist
  );

  const fetchPlaylistInformation = useHeavyPlaylistStore(
    (state) => state.fetchHeavyPlaylistInformation
  );

  const setPlaylistUrl = useHeavyPlaylistStore((state) => state.setPlaylistUrl);

  const playlistUrl = useHeavyPlaylistStore((state) => state.playlistUrl);
  const playlistFetchLoading = useHeavyPlaylistStore(
    (state) => state.playlistFetchLoading
  );

  return (
    <div className="grid gap-4 w-full h-full justify-items-center content-start">
      <div>
        <Input
          placeholder="Enter playlist URL"
          className="col-span-4 overflow-auto w-60"
          value={playlistUrl}
          onChange={(elm) => setPlaylistUrl(elm.target.value)}
          validate={(x: string) => {
            if (x.startsWith("http://") || x.startsWith("https://"))
              return true;
            return "URL must start with http:// or https://";
          }}
          validationBehavior="native"
        />
      </div>

      <div className="w-fit flex  gap-4">
        <Clipboard
          onClick={clipboardReadingHandleForPlaylist}
          className="cursor-pointer text-zinc-700 dark:text-zinc-400"
        />
        <Eraser
          onClick={clearVideoInputFieldForPlaylist}
          className="cursor-pointer text-zinc-700 dark:text-zinc-400"
        />
      </div>
      <div>
        <div className="w-full  grid grid-cols-2 gap-4">
          <Button
            color="primary"
            onPress={fetchPlaylistInformation}
          >
            {playlistFetchLoading ? (
              <Spinner
                variant="wave"
                color="white"
              />
            ) : (
              <span>Light Search</span>
            )}
          </Button>
          <Popover>
            <PopoverTrigger>
              <Button color="success">Deep Search</Button>
            </PopoverTrigger>
            <PopoverContent className="p-2">Coming soon</PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
