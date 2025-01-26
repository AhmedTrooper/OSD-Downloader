import {Fragment, useContext} from "react";
import ImageType from "./ImageType.jsx";
import CloseDialogueBoxImage from "../../assets/images/cross.png";
import {DataContext} from "../../App.jsx";

export default function DownloadDialogMenu() {
    const { setShowDialogBox} = useContext(DataContext);

    return (
        <Fragment>

                 <span className={"bg-red-500 rounded-sm w-fit p-1 grid justify-end"} onClick={() => setShowDialogBox(false)}>
                            <ImageType imageType={CloseDialogueBoxImage}/>

            </span>

        </Fragment>
    );
}