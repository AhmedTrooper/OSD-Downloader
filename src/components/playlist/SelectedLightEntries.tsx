import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import { List, Trash2 } from "lucide-react";

export default function SelectedLightEntries() {
  const modifiedLightEntriesArr = useHeavyPlaylistStore(
    (state) => state.modifiedLightEntriesArr
  );
  const removeItemsFromLightModifiedEntriesArr = useHeavyPlaylistStore(
    (state) => state.removeItemsFromLightModifiedEntriesArr
  );

  if (!modifiedLightEntriesArr) return;

  return (
    <div className="rounded-md h-max-[80vh] shadow-black shadow-md p-2 grid  overflow-auto custom-scrollbar">
      <div className="max-h-[60vh]  grid overflow-auto custom-scrollbar">
        <h1 className="font-bold text-3xl items-center flex p-2 gap-4">
          <List />
          <span>Selected Videos</span>
        </h1>
        {modifiedLightEntriesArr.map((fileEntry, index) => (
          <div
            className="shadow-black shadow-sm p-2 rounded-sm flex gap-4"
            key={index}
          >
            <span
              onClick={() => removeItemsFromLightModifiedEntriesArr(fileEntry)}
            >
              <Trash2 className="text-red-600 cursor-pointer" />
            </span>
            {fileEntry.title}
          </div>
        ))}
      </div>
    </div>
  );
}
