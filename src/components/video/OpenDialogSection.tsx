import { useUserInputVideoStore } from "@/store/UserInputVideoStore";
import { Button } from "@heroui/react";

export default function OpenDialogSection() {
  const setFormatSectionVisible = useUserInputVideoStore(
    (state) => state.setFormatSectionVisible
  );
  const formatSectionVisible = useUserInputVideoStore(
    (state) => state.formatSectionVisible
  );

  return (
    <div className="w-full grid mt-2  items-center justify-center p-1">
      <Button
        onPress={() => setFormatSectionVisible(!formatSectionVisible)}
        color={formatSectionVisible ? "danger" : "primary"}
      >
        <span>{formatSectionVisible ? "Close" : "Open"} VFS</span>
      </Button>
    </div>
  );
}
