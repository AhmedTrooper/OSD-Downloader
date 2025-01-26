import {Fragment, useState} from "react";
import ActiveDownload from "../../assets/images/process.png";
import FinishedDownload from "../../assets/images/check.png";
import PauseDownload from "../../assets/images/pause.png";
import ResumeDownload from "../../assets/images/resume.png";
import ImageType from "./ImageType.jsx";

export default function DownloadStatus({
                                           downloadStatus,

                                       })
{
    const imgSrc = downloadStatus==="finished" ? FinishedDownload : downloadStatus==="active" ? PauseDownload :  ResumeDownload ;

    return <Fragment>
        <ImageType imageType={imgSrc} alt="downloadStatus" />
    </Fragment>
}