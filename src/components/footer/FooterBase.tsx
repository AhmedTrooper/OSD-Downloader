import { useApplicationstore } from "@/store/applicationStore";
import YtDlp from "./YtDlp";
import { Trash2 } from "lucide-react";
// import { useDatabaseStore } from "@/store/databaseStore";

export default function FooterBase() {
      const ytDlpVersion = useApplicationstore(state=>state.ytDlpVersion);
      // const emptyDatabase = useDatabaseStore(state=>state.emptyDatabase);
  
  return (
    <div className="w-full grid grid-cols-4 justify-center justify-items-center items-center content-center gap-4 dark:bg-transparent text-white p-2 text-center">
      {ytDlpVersion && <YtDlp/>}
      <Trash2 className="cursor-pointer text-blue-600"/>
      
    </div>
  );
}
