import {Fragment, useContext} from "react";
import DownloadTitle from "../components/home/DownloadsTitle.jsx";
import DownloadList from "../components/home/DownloadList.jsx";
import NavbarComponent from "../components/home/NavbarComponent.jsx";
import Database from '@tauri-apps/plugin-sql';
import { DataContext } from "../App.jsx";
import ImageType from "../components/home/ImageType.jsx";
import TrashImage from "../assets/images/trash.png";





export default function Homepage(){
    const {setDownloadListArr} = useContext(DataContext);

    
  const clearAllDownloads = async()=>{


    try {
        const db = await Database.load('sqlite:test.db');
        await db.execute("DELETE FROM DownloadList");
        setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

    } catch (e){
console.log(e)
    }
}  
    





    
    return <Fragment>
        <div className="rounded absolute self-end justify-self-end bg-yellow-400 w-fit m-24 hover:bg-green-500">
        <button onClick={()=>clearAllDownloads()}>
            <ImageType imageType={TrashImage}/>
        </button>
        </div>
        <NavbarComponent/>
<DownloadTitle/>
<DownloadList/>
    </Fragment>
}