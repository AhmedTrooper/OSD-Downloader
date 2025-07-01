import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import { Button } from "@heroui/react";

export default function OpenHeavyDialogSection() {
  const heavyPlaylistFormatSectionVisible = useHeavyPlaylistStore(
    (state) => state.heavyPlaylistFormatSectionVisible
  );

  const setHeavyPlaylistFormatSectionVisible = useHeavyPlaylistStore(
    (state) => state.setHeavyPlaylistFormatSectionVisible
  );

  return (
    <div className="w-full grid mt-2  items-center justify-center p-1">
      {
        <Button
          onPress={() =>
            setHeavyPlaylistFormatSectionVisible(
              !heavyPlaylistFormatSectionVisible
            )
          }
          color={heavyPlaylistFormatSectionVisible ? "danger" : "primary"}
        >
          <span>
            {heavyPlaylistFormatSectionVisible ? "Close" : "Open"} LPFS
          </span>
        </Button>
      }
    </div>
  );
}
