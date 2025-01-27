import { clsx } from "clsx"
import { useContext, useEffect, useRef } from "react"
import { DataContext } from "../../App";

export default function TutorialPage(){
    const tutorialRef = useRef();

    return <div ref={tutorialRef} className={clsx(
        "fixed h-[90vh] w-screen  z-50 p-5 grid"
    )}>
<div>
    <h1 className=" font-bold text-3xl">[Must] Read this tutorial carefully as well as serially in order to answer the question to skip it for next session and get used to this application</h1>

    <ul className="p-5 grid gap-2 h-[60vh] overflow-y-auto">
        <li className="p-2 shadow-md text-xl shadow-black rounded-sm">
            You can download  only video file or only audio file or a video file with its audio...
            </li>
            <li className="p-2 shadow-md text-xl shadow-black rounded-sm">
                If both video and audio source is available in option, that means server stores audio and video in different host,thus if you want video along with its audio,you have to select an audio stream too....otherwise video will be soundless!
                <br />
                <br />
                Example site : Youtube!
            </li>
            <li className="p-2 shadow-md text-xl shadow-black rounded-sm">
If only video or only audio format is available then just select whatever version you need of them,
because if only video is shown that means video has its audio attatched to it! No Extra merging!
            </li>
            <li className="p-2 shadow-md text-xl shadow-black rounded-sm">
                Some formats can have error like http 404 or else, just select another format!
                But if you select both video and audio stream then only video or the audio or both audio or video can have error,
                in that case first change the video source but keep audio source same, add to download,if error again, this time change audio stream and can select the previous video stream if you want,shuffle like that,change format if error occurs ....
            </li>

    </ul>
    </div> 

       </div>
}