import { useUserInputVideoStore } from "@/store/UserInputVideoStore";
import {
  Button,
  Card,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Switch,
} from "@heroui/react";
import clsx from "clsx";
import { Clipboard, Eraser, List } from "lucide-react";

export default function UserInputSection() {
  const fetchVideoInformation = useUserInputVideoStore(
    (state) => state.fetchVideoInformation
  );
  const isLoadingForJsonCreation = useUserInputVideoStore(
    (state) => state.isLoadingForJsonCreation
  );
  const videoUrl = useUserInputVideoStore((state) => state.videoUrl);
  const setVideoUrl = useUserInputVideoStore((state) => state.setVideoUrl);
  const clipboardReadingHandle = useUserInputVideoStore(
    (state) => state.clipboardReadingHandle
  );
  const clearVideoInputField = useUserInputVideoStore(
    (state) => state.clearVideoInputField
  );
  const downloadPlaylist = useUserInputVideoStore(
    (state) => state.downloadPlaylist
  );

  const setDownloadPlaylist = useUserInputVideoStore(
    (state) => state.setDownloadPlaylist
  );

  return (
    <Card className="w-full grid grid-cols-7 gap-4 justify-items-center p-2 content-center items-center">
      <Input
        placeholder={
          downloadPlaylist ? "Enter video or playlist URL" : "Enter video URL"
        }
        className="col-span-3"
        value={videoUrl}
        onChange={(elm) => setVideoUrl(elm.target.value)}
        validate={(x: string) => {
          if (x.startsWith("http://") || x.startsWith("https://")) return true;
          return "URL must start with http:// or https://";
        }}
        validationBehavior="native"
      />
      <Switch
        width={10}
        height={10}
        color={"success"}
        isSelected={downloadPlaylist}
        onChangeCapture={() => setDownloadPlaylist(!downloadPlaylist)}
      >
        <List
          className={clsx("", {
            "text-green-600": downloadPlaylist,
            "text-red-600": !downloadPlaylist,
          })}
        />
      </Switch>
      <div className="w-fit flex  gap-4">
        <Clipboard
          onClick={clipboardReadingHandle}
          className="cursor-pointer text-zinc-700 dark:text-zinc-400"
        />
        <Eraser
          onClick={clearVideoInputField}
          className="cursor-pointer text-zinc-700 dark:text-zinc-400"
        />
      </div>
      {videoUrl && videoUrl !== "" && (
        <Button
          color="primary"
          variant="shadow"
          className="font-bold w-full col-span-2 grid justify-items-center items-center"
          onPress={fetchVideoInformation}
        >
          {isLoadingForJsonCreation ? (
            <Spinner
              color="white"
              variant="dots"
            />
          ) : (
            "Search"
          )}
        </Button>
      )}

      {(videoUrl || videoUrl) === "" && (
        <Popover>
          <PopoverTrigger>
            <Button
              color="primary"
              variant="shadow"
              className="font-bold w-full col-span-2 grid justify-items-center items-center"
            >
              {isLoadingForJsonCreation ? (
                <Spinner
                  color="white"
                  variant="dots"
                />
              ) : (
                "Search"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <h1>URL can't be empty!</h1>
          </PopoverContent>
        </Popover>
      )}
    </Card>
  );
}
