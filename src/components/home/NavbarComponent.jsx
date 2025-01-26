import {createContext, Fragment, useContext, useEffect, useRef, useState} from "react";
import ImageType from "./ImageType.jsx";
import PasteImage from "../../assets/images/paste.png";
import DownloadImage from "../../assets/images/downloads.png";
import { Command } from '@tauri-apps/plugin-shell';
import DownloadDialog from "./DownloadDialog.jsx";
import {DataContext} from "../../App.jsx";
import {  readText } from '@tauri-apps/plugin-clipboard-manager';

export const NavbarDataContext = createContext();
export default function NavbarComponent() {

    // Component's data......

    const [fileFormatList, setFileFormatList] = useState([]);
    const [fileUrl, setFileUrl] = useState("");
    const fileRef = useRef();
    const [videoTitle, setVideoTitle] = useState("");
    const {showDialogBox,setShowDialogBox} = useContext(DataContext);




    // Component's Effects......


    useEffect(() => {},[fileFormatList,fileUrl,videoTitle]);

    useEffect(() => {

        if(fileUrl.startsWith("https://")){

            if(fileUrl.includes("http://") || fileUrl.includes("ftp://") || fileUrl.includes("sftp://") || fileUrl.includes("mailto:") || fileUrl.includes("tel:") || fileUrl.includes("ssh://")){

                fileRef.current.classList.remove("text-green-500");
                fileRef.current.classList.remove("valid-link");
                fileRef.current.classList.add("text-red-500")


            } else {
                if(fileUrl.includes("https://")){
                    const numberOfProtocol = fileUrl.matchAll("https://");
                    const protocolArr = Array.from(numberOfProtocol);
                    if(protocolArr.length ===1){
                        fileRef.current.classList.remove("text-red-500");
                        fileRef.current.classList.add("valid-link");
                        fileRef.current.classList.add("text-green-500");
                    } else {
                        fileRef.current.classList.remove("text-green-500");
                        fileRef.current.classList.remove("valid-link");
                        fileRef.current.classList.add("text-red-500")
                    }


                } else {
                    fileRef.current.classList.remove("text-green-500");
                    fileRef.current.classList.remove("valid-link");
                    fileRef.current.classList.add("text-red-500")

                }
            }

        } else {
            fileRef.current.classList.remove("text-green-500");
            fileRef.current.classList.remove("valid-link");
            fileRef.current.classList.add("text-red-500")
        }



    },[fileUrl]);



    // Component's functions......

    const fetchData = async () => {
        try {
            setFileFormatList([]);
            setVideoTitle("");
            setShowDialogBox(true);
            const isValidLink = fileRef.current.classList.contains("valid-link") && fileUrl !=="";
            if(isValidLink){

                //command to get file title.....
                const commandToFetchTitle = Command.sidecar('bin/ytdl', [
                    "--get-title",
                    `${fileUrl}`
                ]);

                let titleFetchCommandStatus = await commandToFetchTitle.execute();

                // setVideoTitle();
                if((titleFetchCommandStatus).code===0){
                    setVideoTitle(titleFetchCommandStatus.stdout);
                } else {
                   setVideoTitle("Error fetching title"); 
                }

                //command to get all file formats.....
                const command = Command.sidecar('bin/ytdl', [
                   "-F",
                    `${fileUrl}`
                ]);

                let formatDetailsString;

                // Keep the whole output of the terminal in formatDetailsString variable
                let getFileFormatListCommand = (await command.execute());
                if(getFileFormatListCommand.code===0) {
                    formatDetailsString=getFileFormatListCommand.stdout;
                };
                 



// Find only ID,resolution and file extension using RegX and list them in an array of object
                const regex = /([a-zA-Z0-9]+)\s+(\w+)\s+((\d+x\d+)|audio\s+only)/g;
                let matches;
                const results = [];

                while ((matches = regex.exec(formatDetailsString)) !== null) {
                    results.push({
                        id: matches[1],
                        format: matches[2],
                        resolution: matches[3]
                    });
                }

               setFileFormatList(results);




            } else {
                alert("Wrong URL");
            }
        } catch (e) {
            console.log(e)
        }
    }



    const handleInput = (event)=>{
        setFileUrl(event.target.value);
    }
    
    
    


// Rendered content
    return (
        <Fragment>
            <ul className={"h-fit p-3 grid grid-cols-12 w-[50vw] items-center gap-5 self-start bg-transparent"}>
               <li key={0} className={"col-span-3"} onClick={async ()=> setFileUrl(await readText())}>
                   <ImageType imageType={PasteImage}/>
               </li>
                <li key={1} className={"col-span-6"}>
                    <input
                        ref={fileRef}
                        onChange={handleInput}
                        type="text" placeholder={"Link"}
                        value={fileUrl}
                        className={"text-green-500 valid-link shadow-sm shadow-black p-2 rounded-sm w-full focus:outline-none focus:shadow-outline placeholder:font-bold"}
                    />
                </li>
                <li key={2} className={"col-span-3 rounded-md shadow-sm shadow-black w-fit"} onClick={fetchData}>
                    <ImageType imageType={DownloadImage}/>
                </li>

            </ul>


            {/*Logic to show dialog box...*/}
            {
                !showDialogBox ?
                    null :
                    <NavbarDataContext.Provider value={{setFileFormatList,setVideoTitle,fileFormatList,videoTitle,fileUrl}}>
                        <DownloadDialog  />
                    </NavbarDataContext.Provider>
            }



        </Fragment>
    );
}