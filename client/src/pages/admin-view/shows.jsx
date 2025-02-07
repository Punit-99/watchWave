import { useState } from "react";
import FloatingActionButton from "../../components/admin/fab";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Shows = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to manage Sheet visibility

  const handleOpenSheet = () => {
    setIsSheetOpen(true); // Open the sheet when FAB is clicked
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false); // Close the sheet
  };

  return (
    <>
      {!isSheetOpen && <FloatingActionButton onFabClick={handleOpenSheet} />}
      {/* Conditionally render the FAB */}
      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        className="bg-white"
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          <button onClick={handleCloseSheet}>Close</button>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Shows;
