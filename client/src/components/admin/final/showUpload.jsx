import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShowBasicDetails } from "./tabs/ShowBasicDetails";
import { ShowFileUpload } from "./tabs/showFileUpload";
import { ScrollArea } from "../../ui/scroll-area";
import { Button } from "../../ui/button";
import { toast } from "react-hot-toast";
import {
  FINAL_initialState,
  FINAL_showVideoInitialFormData,
} from "../../../config/formFields";

export const ShowUpload = () => {
  const [activeTab, setActiveTab] = useState("showDetails");
  const [showDetailsData, setShowDetailsData] = useState(FINAL_initialState);
  const [UploadDetailsData, setUploadDetailsData] = useState({});
  const [category, setCategory] = useState("");
  const [prevCategory, setPrevCategory] = useState(null);

  // file reset on category change
  useEffect(() => {
    if (prevCategory !== null && prevCategory !== category) {
      console.log("Resetting upload details in parent");
      setUploadDetailsData({}); // Reset in Parent
    }
    setPrevCategory(category);
  }, [category]);

  useEffect(() => {
    setCategory(showDetailsData.category);
  }, [showDetailsData.category]);

  const handleNext = () => {
    if (activeTab === "showDetails") {
      // if (!category) {
      //   toast.error("Please select a category first.");
      //   return;
      // }
      setActiveTab("showUpload");
    }
  };

  const handlePrevious = () => {
    if (activeTab === "showUpload") {
      setActiveTab("showDetails");
    }
  };

  const handleCancel = () => {
    toast.success("Upload Cancelled.");
    setShowDetailsData(FINAL_initialState);
    setUploadDetailsData({});
  };

  const handleUpload = () => {
    const payload = {
      ...showDetailsData,
      ...UploadDetailsData,
    };
    console.log("FINAL DATA TO BACKEND: ✅🔥", payload);
    toast.success("Show Uploaded Successfully! 🎉");
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* ✅ Tabs */}
      <div className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-md">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val)}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="showDetails">Show Details</TabsTrigger>
            <TabsTrigger value="showUpload">Show Upload</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator className="my-2 bg-gray-600" />

      <div className="p-4 bg-gray-700 rounded-md">
        <ScrollArea className="w-full flex-1 overflow-auto h-[370px]">
          {activeTab === "showDetails" && (
            <ShowBasicDetails
              showDetails={showDetailsData}
              setShowDetails={setShowDetailsData}
            />
          )}
          {activeTab === "showUpload" && (
            <ShowFileUpload
              UploadDetails={UploadDetailsData}
              setUploadDetails={setUploadDetailsData}
              category={category}
            />
          )}
        </ScrollArea>
      </div>

      <div className="flex justify-between items-center mt-4">
        {activeTab === "showDetails" && (
          <>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleNext} disabled={!category}>
              Next
            </Button>
          </>
        )}
        {activeTab === "showUpload" && (
          <>
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
            <Button onClick={handleUpload}>Upload</Button>
          </>
        )}
      </div>
    </div>
  );
};
