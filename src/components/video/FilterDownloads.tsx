import { Divider } from "@heroui/react";

export default function FilterDownloads() {
  return (
    <ul className="p-2">
      <li className="flex p-1 cursor-pointer text-zinc-500">Completed</li>
      <Divider />
      <li className="flex p-1 cursor-pointer text-zinc-500">Paused</li>
      <Divider />
      <li className="flex p-1 cursor-pointer text-zinc-500">Active</li>
      <Divider />
      <li className="flex p-1 cursor-pointer text-zinc-500">Failed</li>
    </ul>
  );
}
