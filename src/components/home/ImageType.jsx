import {Fragment} from "react";


export default function ImageType({
    imageType
                                  }) {
    return (
        <Fragment>
            <img src={imageType} alt="imageFile" className={"w-8 float-left p-1  cursor-pointer bg-transparent"}/>
        </Fragment>
    );
}