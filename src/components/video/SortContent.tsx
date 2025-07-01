import { TitleSort } from "@/interfaces/video/VideoUtility";
import { useVideoUtility } from "@/store/VideoUtility";
import { Divider } from "@heroui/react";
import { SortAsc, SortDesc } from "lucide-react";

export default function SortContent() {
  const sortDownloadsArr = useVideoUtility((state) => state.sortDownloadsArr);

  return (
    <ul className="p-2">
      <li
        onClick={() => sortDownloadsArr(TitleSort.titleAsc)}
        className="flex p-1 cursor-pointer text-zinc-500"
      >
        Title
        <SortAsc className="text-zinc-500" />
      </li>
      <Divider />
      <li
        onClick={() => sortDownloadsArr(TitleSort.titleDesc)}
        className="flex p-1 cursor-pointer text-zinc-500"
      >
        Title
        <SortDesc className="text-zinc-500" />
      </li>
    </ul>
  );
}
