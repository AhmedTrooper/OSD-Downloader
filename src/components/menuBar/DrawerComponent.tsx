import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
 
} from "@heroui/react";
import { Download, ListStart } from "lucide-react";
import PlaylistInputSection from "./PlaylistInputSection";

export default function DrawerComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <p onClick={onOpen}>
        <ListStart className="text-white" />
      </p>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                Playlist Download
              </DrawerHeader>
              <DrawerBody>
                <PlaylistInputSection />
              </DrawerBody>
              <DrawerFooter>
                <Button
                  color="danger"
                  variant="bordered"
                  className="flex"
                  onPress={onClose}
                >
                  <Download /> Close
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
