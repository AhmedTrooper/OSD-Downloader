import {Fragment, useContext, useEffect} from "react";
import FileImage from "../../assets/images/folder-open.png";
import TrashImage from "../../assets/images/trash.png";
import DownloadStatus from "./DownloadStatus.jsx";
import ImageType from "./ImageType.jsx";
import {clsx} from "clsx";
import Database from '@tauri-apps/plugin-sql';
import { DataContext } from "../../App.jsx";


export default function DownloadItem({
     downloadStatus,
    downloadTitle,
    processID,
    downloadTrackingMessage

   }) {


    const {setDownloadListArr} = useContext(DataContext);
    const removeFromDownloadList = async (downloadID)=>{
try {
   const db = await Database.load('sqlite:test.db');
   await db.execute(
    "DELETE FROM DownloadList WHERE id = $1",
    [downloadID]
   ); 
   setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

} catch (err){
console.log(err);
}
    }

   


    return (
        <Fragment>
            <div className={clsx(
                "shadow-md shadow-black w-[95vw] p-1 grid grid-cols-12 h-fit items-center rounded-sm",
                {
                    "bg-green-500" : downloadStatus==="finished",
                    "bg-red-500": downloadStatus==="cancelled",
                    "bg-blue-500": downloadStatus==="active"
                }
            )}>
                <div className="w-fit grid grid-cols-3 col-span-2 bg-transparent">
                    <span className={"w-fit h-fit bg-transparent"}>
                                            <DownloadStatus downloadStatus={downloadStatus}/>

                    </span>
                    <ImageType imageType={FileImage}/>
                    <span className={"w-fit h-fit bg-transparent"} onClick={()=>removeFromDownloadList(processID)}>
                                            <ImageType imageType={TrashImage}/>

                    </span>

                </div>
                <div className=" p-1 grid col-span-10 bg-transparent">
                <p className={clsx(
                    "float-left col-span-10 truncate bg-transparent",
                )}>
                    {downloadTitle}
                </p>

                </div>

                <div className="col-span-12 grid  shadow-lg shadow-black p-2 content-center items-center justify-content-center justify-items-center bg-transparent rounded-sm">
                    <h1 className="bg-transparent text-black">{downloadTrackingMessage}</h1>
                </div>
            </div>
        </Fragment>
    )
}