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
import { uploadMovieFormControls } from "../../config/formFields";
import { useDispatch } from "react-redux";
import CommonForm from "../../components/common/commonForm";

const initialState = {
  title: "",
  description: "",
  category: "",
  genres: [],
  releaseDate: "",
  poster: null,
  trailerUrl: "",
  videoUrl: "",
  rating: "",
  isFeatured: false,
};

const Shows = () => {
  const [formData, setFormData] = useState(initialState);

  const [isSheetOpen, setIsSheetOpen] = useState(false); // State to manage Sheet visibility

  const handleOpenSheet = () => {
    setIsSheetOpen(true); // Open the sheet when FAB is clicked
  };

  // const handleCloseSheet = () => {
  //   setIsSheetOpen(false); // Close the sheet
  // };

  function onSubmit() {
    console.log("Upload Clicked");
  }

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
            <SheetTitle>Show Upload</SheetTitle>
            <SheetDescription>
              <CommonForm
                formControls={uploadMovieFormControls}
                buttonText={"Upload"}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Shows;
