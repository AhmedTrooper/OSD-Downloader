
import {Fragment, useContext, useEffect} from "react";
import DownloadItem from "./DownloadItem.jsx";
import {DataContext} from "../../App.jsx";
export default function DownloadList(){

    
    const {downloadListArr} = useContext(DataContext);
    useEffect(()=>{

    },[downloadListArr])




    return <Fragment>

        {
            downloadListArr.length > 0 ? (
                <div className={"grid gap-2 content-start    w-[98vw] justify-self-center self-start p-2 h-[60vh] overflow-y-auto hide-scrollbar "}>
                    {
                        downloadListArr.map((item,index)=>(
                            <DownloadItem key={index+item.downloadStatus}
                                downloadStatus={item.downloadStatus}
                                downloadTitle={` [ ${item.selectedFileFormat} ] ` + " " + item.videoTitle}
                                          processID={item.id}
                                          downloadTrackingMessage={item.downloadTrackingMessage}
                            />
                        ))
                    }



                </div>
            ) : (
                <Fragment>
                    {null}
                </Fragment>
            )
        }

    </Fragment>
}