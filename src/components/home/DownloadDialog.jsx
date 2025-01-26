import {Fragment, useContext, useEffect, useState} from "react";
import ImageType from "./ImageType.jsx";
import AddImage from "../../assets/images/plus.png";
import {videoDir} from "@tauri-apps/api/path";
import {Command} from "@tauri-apps/plugin-shell";
import DownloadDialogMenu from "./DownloadDialogMenu.jsx";
import VideoTitle from "./VideoTitle.jsx";
import SnakeSpinner from "../../assets/images/snake_spinner.svg";
import {DataContext} from "../../App.jsx";
import {NavbarDataContext} from "./NavbarComponent.jsx";
import Database from '@tauri-apps/plugin-sql';




export default function DownloadDialog() {

    //Component's data.....

    const [selectedFile, setSelectedFile] = useState(null);
    const {setDownloadListArr,downloadListArr,setShowDialogBox} = useContext(DataContext);
    const {setFileFormatList,setVideoTitle,fileFormatList,fileUrl,videoTitle} = useContext(NavbarDataContext);

    const addSelectedQuality = async ()=>{
        try{
            let hasStdError = false;
            const db = await Database.load('sqlite:test.db');

            const videoDirectory = await  videoDir();
            const fileFormatId = selectedFile.split("____")[0];
            const commandOfSelected = Command.sidecar('bin/ytdl', [
                "-f",
                `${fileFormatId}`,
                "-o",
                `${videoDirectory}/OSDownloader/%(title)s${selectedFile}.%(ext)s`,
                `${fileUrl}`
            ]);

            const urlOfIle = fileUrl;
            const selectedFileFormat = selectedFile;
            const downloadID = `[[${selectedFileFormat}]]_${urlOfIle}`;
            const downloadAlreadyFound = await db.select(
                `SELECT * FROM DownloadList WHERE id = $1`,
                [downloadID]
            );

            const child = await commandOfSelected.spawn();

                         if(downloadAlreadyFound.length == 0) {
                              const createVideoInfo = await db.execute(
                            "INSERT into DownloadList (id, videoTitle, downloadStatus,downloadTrackingMessage,selectedFileFormat) VALUES ($1, $2, $3, $4, $5)",
                            [downloadID, videoTitle, "active","Retriving download info",selectedFileFormat],
                         );
                         }


                         setDownloadListArr(await db.select("SELECT * FROM DownloadList"));
                     
            commandOfSelected.stdout.on("data", async (data)=>{
                const createVideoInfo = await db.execute(
                   "UPDATE DownloadList SET downloadTrackingMessage = $1 WHERE id = $2",
[data,downloadID],
                 );
                 setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

            });



            commandOfSelected.stderr.on("data", async (data)=>{
             try {
                hasStdError = true;               
                const createVideoInfo = await db.execute(
                    "UPDATE DownloadList SET downloadStatus = $1,downloadTrackingMessage = $2 WHERE id = $3",
 ["cancelled",data,downloadID],
                  );
                  setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

             } catch(e){
                console.log(e);
             }

            })


            //If command goes wrong
commandOfSelected.on("error",e=>{
    setHadError(true);
});

//when command is about to close
commandOfSelected.on("close",async m=>{
    if(hasStdError) setDownloadListArr(await db.select("SELECT * FROM DownloadList"));
    else {
        try{
            const createVideoInfo = await db.execute(
                "UPDATE DownloadList SET downloadStatus = $1 WHERE id = $2",
["finished",downloadID],
              );
              setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

        } catch(e){
console.log(e);
        }
    }
 
    
});




            setShowDialogBox(false);
            setVideoTitle("");
            setFileFormatList([]);

        } catch (e) {
            console.log(e);
        }
    }



    //function to add the best quality....

    const addBestQuality  = async ()=>{

        try {
            let hasStdError = false;
            const db = await Database.load('sqlite:test.db');
            const videoDirectory = await  videoDir();
            const commandOfBest = Command.sidecar('bin/ytdl', [
                "-f",
                "bestvideo+bestaudio/best",
                "-o",
                `${videoDirectory}/OSDownloader/%(title)s[BestQuality].%(ext)s`,
                `${fileUrl}`
            ]);

            const urlOfIle = fileUrl;
            const selectedFileFormat = selectedFile;
            const downloadID = `[[BESTFILEFORMAT]]_${urlOfIle}`;
            const downloadAlreadyFound = await db.select(
                `SELECT * FROM DownloadList WHERE id = $1`,
                [downloadID]
            );

            const child = await commandOfBest.spawn();

                         if(downloadAlreadyFound.length == 0) {
                              const createVideoInfo = await db.execute(
                            "INSERT into DownloadList (id, videoTitle, downloadStatus,downloadTrackingMessage,selectedFileFormat) VALUES ($1, $2, $3, $4, $5)",
                            [downloadID, videoTitle, "active","Retriving download info","BESTFILEFORMAT"],
                         );
                         }


                         setDownloadListArr(await db.select("SELECT * FROM DownloadList"));
                     
                         commandOfBest.stdout.on("data", async (data)=>{
                console.log(data);
                const createVideoInfo = await db.execute(
                   "UPDATE DownloadList SET downloadTrackingMessage = $1 WHERE id = $2",
[data,downloadID],
                 );
                 setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

            });



            commandOfBest.stderr.on("data", async (data)=>{
             try {
                hasStdError = true;
                const createVideoInfo = await db.execute(
                    "UPDATE DownloadList SET downloadStatus = $1,downloadTrackingMessage = $2 WHERE id = $3",
 ["cancelled",data,downloadID],
                  );
                  setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

             } catch(e){
                console.log(e);
             }

            })


            //If command goes wrong
            commandOfBest.on("error",e=>{
    setHadError(true);
});

//when command is about to close
commandOfBest.on("close",async m=>{
    if(hasStdError) setDownloadListArr(await db.select("SELECT * FROM DownloadList"));
    else {
        try{
            const createVideoInfo = await db.execute(
                "UPDATE DownloadList SET downloadStatus = $1 WHERE id = $2",
["finished",downloadID],
              );
              setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

        } catch(e){
console.log(e);
        }
    }
 
    
});




            setShowDialogBox(false);
            setVideoTitle("");
            setFileFormatList([]);

            

        } catch (e) {
            console.log(e)
        }
    }



    //     This Section should be shown after a link is added to fetch data......

    return (
        <Fragment>
            <div
                className={"grid gap-2 absolute w-[100vw] h-[100vh] z-30 rounded-sm   justify-self-center  content-start shadow-md shadow-black"}>
                <div className={"w-[100vw]  h-fit p-2"}>
                    <DownloadDialogMenu/>
                </div>

                {/*Video Title section*/}
                <VideoTitle videoTitle={videoTitle}/>


                {/*<span className={"font-bold"}>Choose Format : </span>*/}
                <div className={"w-[90vw]  grid self-center  p-5 justify-self-center h-full"}>

                    <ul className={"overflow-y-scroll hide-scrollbar  h-[50vh] w-[80vw] justify-self-center self-center justify-items-center p-5 grid gap-2"}>
                        {
                            fileFormatList.length > 0 ? (fileFormatList.map((fileFormat, index) => (

                                <li
                                    key={fileFormat.id + fileFormat["format"] + fileFormat["resolution"] + index}
                                    className={"w-full  justify-self-center text-xl h-fit font-bold shadow-lg rounded-sm hover:cursor-pointer hover:bg-red-500 p-2 text-center hover:rounded-sm"}
                                    onClick={() => setSelectedFile(fileFormat.id + '____' + fileFormat["format"] + '_' + fileFormat["resolution"] + '_')}
                                >
                                    {fileFormat["format"].toUpperCase()} || {fileFormat["resolution"].toUpperCase()}

                                </li>
                            ))) : (<li className={"h-fit self-center justify-self-center"}>
                                <ImageType imageType={SnakeSpinner}/>
                            </li>)

                        }
                    </ul>
                </div>


                <div className={"absolute self-end w-full grid grid-cols-2 gap-2 p-2"}>
                    <div
                        className={" rounded-sm shadow-sm bg-blue-500 shadow-black w-full font-bold justify-self-center grid grid-cols-2 p-2 justify-items-center  items-center cursor-pointer"}
                        onClick={addSelectedQuality}>
                        Add Selected Quality [ {selectedFile} ]
                        <ImageType imageType={AddImage}/>
                    </div>

                    {/*Add the Highest quality to download list*/}
                    <div
                        className={"rounded-sm font-bold w-full justify-self-center bg-green-500 shadow-sm shadow-black  grid p-2 grid-cols-2 justify-items-center content-center items-center cursor-pointer"}
                        onClick={addBestQuality}>
                        Add Best Quality
                        <ImageType imageType={AddImage}/>
                    </div>
                </div>
            </div>
        </Fragment>


    );
}