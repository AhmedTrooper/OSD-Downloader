import {Fragment} from "react";
import AllDownloads from "../../assets/images/border-all.png";
import ActiveDownloads from "../../assets/images/process.png";
import FinishesDownloads from "../../assets/images/check.png";
import CancelDownloads from "../../assets/images/cross.png";
import {DownloadsStatusConst} from "../../constants/DownloadsStatusConst.js";
import {clsx} from "clsx";

export default function DownloadTitle(){
    return <Fragment>
        <ul className={"grid grid-cols-4 gap-1 p-2 w-fit content-center h-fit justify-items-center"}>
            {
                DownloadsStatusConst.map((downloads)=> (
                    <li key={downloads.title + downloads.status}>
                        <span className={clsx(
                            "font-bold",
                            {
                                "text-blue-500": downloads.active
                            }
                        )}>{downloads.title}</span>
                    </li>
                ))
            }



            {/*Images of list....*/}

            <li>
                <img src={AllDownloads} alt="" className={"w-6 cursor-pointer"}/>
            </li>
            <li>
                <img src={ActiveDownloads} alt="" className={"w-6 cursor-pointer"}/>
            </li>
            <li>
                <img src={FinishesDownloads} alt="" className={"w-6 cursor-pointer"}/>
            </li>
            <li>
                <img src={CancelDownloads} alt="" className={"w-6 cursor-pointer"}/>
            </li>
        </ul>
    </Fragment>
}