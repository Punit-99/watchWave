import { useState } from "react";
import FloatingActionButton from "../../components/admin/fab";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator"; // Corrected import
import { uploadMovieFormControls } from "../../config/formFields";
import CommonForm from "../../components/common/commonForm";
import { Button } from "../../components/ui/button";

const Shows = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Controls Sheet visibility

  // Initialize form state inside the component
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    genres: "", // Changed from [] to "" for single selection
    releaseDate: "",
    poster: null,
    trailerUrl: "",
    videoUrl: "",
    rating: "",
    isFeatured: false,
  });

  const handleOpenSheet = () => setIsSheetOpen(true); // Open the sheet when FAB is clicked

  const onSubmit = () => {
    console.log("Upload Clicked", formData);
  };

  return (
    <>
      {!isSheetOpen && <FloatingActionButton onFabClick={handleOpenSheet} />}
      {/* Conditionally render FAB when Sheet is closed */}

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="border-none shadow-2xl">
          <SheetHeader>
            <SheetTitle>Show Upload</SheetTitle>
          </SheetHeader>

          <Separator className="my-2" />

          <ScrollArea className="h-[500px] w-auto rounded-md border p-4">
            <SheetDescription>
              <CommonForm
                formControls={uploadMovieFormControls}
                buttonText="Upload"
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
              />
            </SheetDescription>
          </ScrollArea>
          <SheetFooter>
            <SheetClose>
              <div className="flex justify-items-center align-middle gap-2">
                <Button type="submit">Save changes</Button>
                <Button type="submit">Save changes</Button>
              </div>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Shows;
