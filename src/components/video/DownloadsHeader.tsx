import { Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import SortContent from "./SortContent";
import { Logs } from "lucide-react";
// import FilterDownloads from "./FilterDownloads";

export default function DownloadsHeader() {
  return (
    <div className=" mt-4 mb-4 p-2 flex gap-4 items-center">
      <Popover
        placement="bottom-end"
        className="outline-none focus:outline-none"
      >
        <PopoverTrigger>
          <p>
            <Logs className="cursor-pointer text-zinc-500" />
          </p>
        </PopoverTrigger>
        <PopoverContent>
          <SortContent />
        </PopoverContent>
      </Popover>
      {/* <Popover placement="bottom-end">
        <PopoverTrigger>
          <p>
            <Filter className="cursor-pointer text-zinc-500" />
          </p>
        </PopoverTrigger>
        <PopoverContent>
          <FilterDownloads />
        </PopoverContent>
      </Popover> */}
      <h1 className="text-3xl font-bold">Download List</h1>
    </div>
  );
}
