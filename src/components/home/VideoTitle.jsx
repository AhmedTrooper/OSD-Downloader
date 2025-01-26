import ImageType from "./ImageType.jsx";
import LoaderImage from "../../assets/images/loader.svg";
import {Fragment} from "react";


export default function VideoTitle({
    videoTitle
                                   }) {
    return (
        <Fragment>

            {
                videoTitle !=="" ? (<div className={"w-[90vw] grid  justify-self-center  h-fit font-bold text-xl"}>
<h1 className={"w-80vw justify-self-center bg-transparent p-2"}>{videoTitle}</h1>
                </div>) : (
<div className={"w-[90vw]  justify-self-center h-fi grid justify-items-center items-center"}><ImageType imageType={LoaderImage}/></div>

                )
            }
        </Fragment>
)
    ;
}