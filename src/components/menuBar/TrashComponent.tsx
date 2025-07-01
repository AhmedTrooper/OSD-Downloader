import { useDatabaseStore } from "@/store/databaseStore";
import { Trash2Icon } from "lucide-react";

export default function TrashComponent() {
     const emptyDatabase = useDatabaseStore(state=>state.emptyDatabase);
  return (
    <div className="self-center justify-self-center text-red-600">
      <Trash2Icon  onClick={emptyDatabase} className="cursor-pointer" />
    </div>
  );
}
