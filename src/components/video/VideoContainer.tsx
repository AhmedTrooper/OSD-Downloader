import { useUserInputVideoStore } from "@/store/UserInputVideoStore";
import OpenDialogSection from "./OpenDialogSection";
import UserInputSection from "./UserInputSection";
import FormatSection from "./FormatSection";
import DownloadSection from "./DownloadSection";
import { useHeavyPlaylistStore } from "@/store/HeavyPlaylistStore";
import HeavyPlaylistFormatSection from "../playlist/HeavyPlaylistFormatSection";
import OpenHeavyDialogSection from "./OpenHeavyDialogSection";

export default function VideoContainer() {
  const dialogSectionVisible = useUserInputVideoStore(
    (state) => state.dialogSectionVisible
  );
  const formatSectionVisible = useUserInputVideoStore(
    (state) => state.formatSectionVisible
  );
  const videoInformation = useUserInputVideoStore(
    (state) => state.videoInformation
  );
  const heavyPlaylistFormatSectionVisible = useHeavyPlaylistStore(
    (state) => state.heavyPlaylistFormatSectionVisible
  );

  const heavyPlaylistInformation = useHeavyPlaylistStore(
    (state) => state.heavyPlaylistInformation
  );

  return (
    <div className="video-container">
      <UserInputSection />
      {dialogSectionVisible && videoInformation && <OpenDialogSection />}
      {formatSectionVisible && <FormatSection />}
    {heavyPlaylistInformation && <OpenHeavyDialogSection/>}
      {heavyPlaylistFormatSectionVisible && <HeavyPlaylistFormatSection/>}
      <DownloadSection />
    </div>
  );
}
