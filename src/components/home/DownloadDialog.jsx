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

    const [selectedVideoStream, setselectedVideoStream] = useState(null);
    const [selectedAudio,setSelectedAudio] = useState(null);
    const {setDownloadListArr,downloadListArr,setShowDialogBox} = useContext(DataContext);
    const {setFileFormatList,setVideoTitle,fileFormatList,fileUrl,videoTitle} = useContext(NavbarDataContext);
    const [isDisable,setIsDisable] = useState(true);

    useEffect(()=>{
        if(selectedAudio || selectedVideoStream) setIsDisable(false);
        else setIsDisable(true);
    },[selectedAudio,selectedVideoStream]);

    const addSelectedQuality = async ()=>{
        try{
            console.log(selectedVideoStream,selectedAudio);


            let hasStdError = false;


            const db = await Database.load('sqlite:test.db');
            const videoDirectory = await  videoDir();




            let videoFormatId;
            if(selectedVideoStream){
                videoFormatId = selectedVideoStream.split("____")[0];
            } else {
                videoFormatId = selectedVideoStream;
            }


            let audioFormatId;
            if(selectedAudio){
                audioFormatId = selectedAudio.split("____")[0];
            } else {
                audioFormatId = selectedAudio;
            }


            let commandOfSelected;
            if(audioFormatId && videoFormatId){
                console.log("Both available");
                commandOfSelected = Command.sidecar('bin/ytdl', [
                    "-f",
                    `${videoFormatId}+${audioFormatId}`,
                    "-o",
                    `${videoDirectory}/OSDownloader/%(title)s${audioFormatId}_${selectedAudio}.%(ext)s`,
                    `${fileUrl}`
                ]);
            } else if(audioFormatId){
                console.log("Only audio");
                console.log(audioFormatId)

                commandOfSelected = Command.sidecar('bin/ytdl', [
                    "-f",
                    `${audioFormatId}`,
                    "-o",
                    `${videoDirectory}/OSDownloader/%(title)s_${selectedAudio}.%(ext)s`,
                    `${fileUrl}`
                ]);

            } else {
                console.log("Video only");
                console.log(videoFormatId);

                commandOfSelected = Command.sidecar('bin/ytdl', [
                    "-f",
                    `${videoFormatId}`,
                    "-o",
                    `${videoDirectory}/OSDownloader/%(title)s_${videoFormatId}.%(ext)s`,
                    `${fileUrl}`
                ]);
            }

            const urlOfIle = fileUrl;
            const selectedVideoStreamFormat = selectedVideoStream;
            let selectedAudioStream = selectedAudio;
            let downloadID;
            if(selectedAudioStream && selectedVideoStreamFormat){
                downloadID = `[[${selectedVideoStreamFormat + selectedAudioStream}]]_${urlOfIle}`;

            } else if(selectedAudioStream){
                downloadID = `[[${selectedAudioStream}]]_${urlOfIle}`;

            } else {
                downloadID = `[[${selectedVideoStreamFormat}]]_${urlOfIle}`;

            }
            const downloadAlreadyFound = await db.select(
                `SELECT * FROM DownloadList WHERE id = $1`,
                [downloadID]
            );

            const child = await commandOfSelected.spawn();

                         if(downloadAlreadyFound.length == 0) {
                              const createVideoInfo = await db.execute(
                            "INSERT into DownloadList (id, videoTitle, downloadStatus,downloadTrackingMessage,selectedFileFormat) VALUES ($1, $2, $3, $4, $5)",
                            [downloadID, videoTitle, "active","Retriving download info",selectedVideoStreamFormat],
                         );
                         }


                         setDownloadListArr(await db.select("SELECT * FROM DownloadList"));
                     
            commandOfSelected.stdout.on("data", async (data)=>{
                hasStdError = false;  
                console.log("Std data start",data,"std end");             

                const createVideoInfo = await db.execute(
                   "UPDATE DownloadList SET downloadTrackingMessage = $1 WHERE id = $2",
[data,downloadID],
                 );
                 setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

            });



            commandOfSelected.stderr.on("data", async (data)=>{
             try {
                hasStdError = true;   
                console.log("Std error :",data,"Std error end");
            
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
    console.log("Command Error start\t",e,"\tCommand Error end");
    hasStdError = true;
});

//when command is about to close
commandOfSelected.on("close",async m=>{
    console.log("Closed :",m);
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
            console.log("Full command ended!");


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
            const selectedVideoStreamFormat = selectedVideoStream;
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
                hasStdError = false;               

                const createVideoInfo = await db.execute(
                   "UPDATE DownloadList SET downloadTrackingMessage = $1 WHERE id = $2",
[data,downloadID],
                 );
                 setDownloadListArr(await db.select("SELECT * FROM DownloadList"));

            });



            commandOfBest.stderr.on("data", async (data)=>{
             try {
                console.log("Std error :",data,"Std error end");
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
                hasStdError = false;  
                console.log("Command Error start\t",e,"\tCommand Error end");             
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
              console.log("Closing :",m," Done")

        } catch(e){
            console.log("Command close error start\t",e,"\tCommand close Error end");
        }
    }
 
    
});




            setShowDialogBox(false);
            setVideoTitle("");
            setFileFormatList([]);

            
console.log("Full command ended!");
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
                <div className={"w-[90vw]  grid grid-cols-2 self-center  p-5 justify-self-center h-full"}>

                    <ul className={"content-start overflow-y-scroll hide-scrollbar  h-[50vh] w-fit justify-self-center self-center justify-items-center p-5 grid gap-2"}>
                        <li  className={"w-full text-[20px] text-blue-500  justify-self-center  h-fit font-bold shadow-lg rounded-sm  p-2 text-center hover:rounded-sm"}>
Video                            </li>
                            <li className={"w-full  justify-self-center text-xl h-fit font-bold shadow-lg rounded-sm hover:cursor-pointer hover:bg-red-500 p-2 text-center hover:rounded-sm"}
             onClick={() => setselectedVideoStream(null)}>
First select an audio and then  click me if want to download audio only</li>

                        {
                            fileFormatList.length > 0 ? (fileFormatList.map((fileFormat, index) => {
                                if(fileFormat.resolution !== "audio"){
                                    return (

                                        <li
                                            key={fileFormat.id + fileFormat["format"] + fileFormat["resolution"] + index}
                                            className={"w-full  justify-self-center text-xl h-fit font-bold shadow-lg rounded-sm hover:cursor-pointer hover:bg-red-500 p-2 text-center hover:rounded-sm"}
                                            onClick={() => setselectedVideoStream(fileFormat.id + '____' + fileFormat["format"] + '_' + fileFormat["resolution"] + '_')}
                                        >
                                           {fileFormat["id"].toUpperCase()} || {fileFormat["format"].toUpperCase()} || {fileFormat["resolution"].toUpperCase()}
        
                                        </li>
                                    );
                                }
                            })) : (<li className={"h-fit self-center justify-self-center"}>
                                <ImageType imageType={SnakeSpinner}/>
                            </li>)

                        }
                    </ul>






                    <ul className={"content-start overflow-y-scroll hide-scrollbar  h-[50vh] w-fit justify-self-center self-center justify-items-center p-5 grid gap-2"}>
                    <li  className={"w-full  justify-self-center text-[20px] text-blue-500 h-fit font-bold shadow-lg rounded-sm  p-2 text-center hover:rounded-sm"}>
Audio
                            </li>
                            <li className={"w-full  justify-self-center text-xl h-fit font-bold shadow-lg rounded-sm hover:cursor-pointer hover:bg-red-500 p-2 text-center hover:rounded-sm"}
             onClick={() => setSelectedAudio(null)}>
First select a video and then click me if want to download video only</li>
                        {
                            fileFormatList.length > 0 ? (fileFormatList.map((fileFormat, index) => {
                                if(fileFormat.resolution === "audio"){
                                    return (

                                        <li 
                                            key={fileFormat.id + fileFormat["format"] + fileFormat["resolution"] + index}
                                            className={"w-full  justify-self-center text-xl h-fit font-bold shadow-lg rounded-sm hover:cursor-pointer hover:bg-red-500 p-2 text-center hover:rounded-sm"}
                                            onClick={() => setSelectedAudio(fileFormat.id + '____' + fileFormat["format"] + '_' + fileFormat["resolution"] + '_')}
                                        >
                                           {fileFormat["id"].toUpperCase()} || {fileFormat["format"].toUpperCase()} || {fileFormat["resolution"].toUpperCase()}
        
                                        </li>
                                    );
                                }
                            })) : (<li className={"h-fit self-center justify-self-center"}>
                                <ImageType imageType={SnakeSpinner}/>
                            </li>)

                        }
                    </ul>
                </div>


                <div className={"absolute self-end w-full grid grid-cols-2 gap-2 p-2"}>
                    <button disabled={isDisable}
                        className={" rounded-sm shadow-sm bg-blue-500 shadow-black w-full font-bold justify-self-center grid grid-cols-2 p-2 justify-items-center  items-center cursor-pointer"}
                        onClick={addSelectedQuality}>
                        <span className="col-span-2 bg-transparent">
                        <span className="bg-transparent">Click me to Add Selected Quality</span>
                        <br />
                        <span className="text-black bg-transparent">
                            {selectedVideoStream ? (`Selected video stream : ${selectedVideoStream}`) : null}
                        </span>
                        <span className="text-black bg-transparent">
                            {selectedAudio ? (`Selected audio stream : ${selectedAudio}`) : null}
                        </span>
                        </span>
                        
                        <span className="col-span-2 bg-transparent">
                        <ImageType imageType={AddImage}/>

                        </span>
                    </button>

                    {/*Add the Highest quality to download list*/}
                    <div
                        className={"rounded-sm font-bold w-full justify-self-center bg-green-500 shadow-sm shadow-black  grid p-2 grid-cols-2 justify-items-center content-center items-center cursor-pointer"}
                        onClick={addBestQuality}>
                        Click me to Add Best Quality
                        <ImageType imageType={AddImage}/>
                    </div>
                </div>
            </div>
        </Fragment>


    );
}