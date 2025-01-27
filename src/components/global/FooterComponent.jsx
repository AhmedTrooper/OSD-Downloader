import {Fragment} from "react";
import {NavLink, Route} from "react-router";
import SettingImage from "../../assets/images/settings.png"
import DownloadsImage from "../../assets/images/downloads.png"
import GithubImage from "../../assets/images/github.png";
import TutorialImage from "../../assets/images/tutorial.png"


export default function FooterComponent(){
    return <Fragment>
        <nav className={"grid grid-cols-2 p-2 h-fit self-end mb-0 absolute w-full shadow-2xl shadow-black"}>
            <ul className={"grid grid-cols-2 w-fit  p-2 gap-5"}>
                <li>
                    <NavLink to={"/"}>
                        <img src={DownloadsImage} alt="setting" className={"w-6"}/>

                    </NavLink>
                </li>
                <li>
                    <NavLink to={"/tutorial"}>
                        <img src={TutorialImage} alt="setting" className={"w-6"}/>
                    </NavLink>
                </li>
            </ul>
            <ul className={"grid grid-cols-1 w-fit self-end p-2 gap-5 justify-self-end"}>
                <li>
                    <NavLink to={"https://github.com/"} target={"_blank"}>
                        <img src={GithubImage } alt="setting" className={"w-6"}/>
                    </NavLink>
                </li>
            </ul>
        </nav>

    </Fragment>
}