import { useApplicationstore } from "@/store/applicationStore";
import { Alert } from "@heroui/alert";
import {Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

export default function YtDlp(){
    const ytDlpVersion = useApplicationstore(state=>state.ytDlpVersion);
    return(<div className="grid">
        <Popover placement="top">
            <PopoverTrigger>
                        <Alert color="success" className="cursor-pointer" variant="faded">{ytDlpVersion}</Alert>

            </PopoverTrigger>
            <PopoverContent>
                <div className="p-2">You are using latest yt-dlp binary!</div>
                
            </PopoverContent>
        </Popover>
    </div>);
}