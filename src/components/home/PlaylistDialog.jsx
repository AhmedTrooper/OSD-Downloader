import ImageType from "./ImageType";
import CloseDialogueBoxImage from "../../assets/images/cross.png";
import { useContext } from "react";
import { DataContext } from "../../App";
import { NavbarDataContext } from "./NavbarComponent";

export default function PlaylistDialog(){

        const {
            setShowDialogBox,
            showPlaylistDialogBox,
            setShowPlaylistDialogBox,
            playlistLinkArr,
            setPlaylistLinkArr
        } = useContext(DataContext);

        const {fetchData,setFileUrl,fileUrl} = useContext(NavbarDataContext);
    

const fetchUrlData = async ()=>{
    try{
        await fetchData();
    } catch(e){
        console.log(e)
    }
}






    return <div className="shadow-md shadow-black w-[50vw] h-[100vh] grid absolute p-2 justify-self-end overflow-y-scroll hide-scrollbar ">
        <button onClick={()=>setShowPlaylistDialogBox(false)} className="fixed p-1 rounded-sm hover:bg-red-500 mt-2 ml-2 w-fit hover:shadow-md hover:shadow-gray-950">
            <ImageType imageType={CloseDialogueBoxImage}/>
        </button>
        <div className="grid pt-20 p-2 gap-2 ">
        {
            playlistLinkArr.length > 0 && playlistLinkArr.map((item,index)=>(<p onMouseUp={()=>setFileUrl(item.siteUrl)} onClick={()=> fetchUrlData(item.siteUrl)} key={item.title + item.siteUrl} className="h-10 hover:bg-green-500 cursor-pointer shadow-md shadow-black p-2 rounded-sm"> [{index}] {item.title}</p>))
        }
        
        </div>
        
   
    </div>
}