import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import BasicInfoForm from "../../components/admin/show-uplaod/BasicInfoForm";
import VideoUploadForm from "../../components/admin/show-uplaod/VideoUploadForm";
import MediaUploadForm from "../../components/admin/show-uplaod/MediaUploadForm";
import {
  showInitialFormData,
  showVideoInitialFormData,
  showMediaInitialFormData,
} from "../../config/formFields";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { useOutletContext } from "react-router-dom"; // Get modal state from Layout

export default function ShowUpload() {
  // Access modal state from Layout
  const [openModal, setOpenModal] = useOutletContext();
  const [showFormData, setShowFormData] = useState(showInitialFormData);
  const [showVideoFormData, setShowVideoFormData] = useState(
    showVideoInitialFormData
  );
  const [showMediaFormData, setShowMediaFormData] = useState(
    showMediaInitialFormData
  );

  // Tabs state to manage navigation
  const [activeTab, setActiveTab] = useState("basic-info");

  // Add new episode (Web series)
  function handleAddEpisode() {}

  // Remove an episode (Web series)
  function handleRemoveEpisode(index) {
    setShowVideoFormData(showVideoFormData.filter((_, i) => i !== index));
  }

  // Handle image upload (just storing file info for now)
  function handleImageUpload(event, type) {}

  // Submit handler
  function handleSubmit() {}

  // Handle tab navigation
  function handleNextTab() {
    if (activeTab === "basic-info") setActiveTab("video-upload");
    else if (activeTab === "video-upload") setActiveTab("media-upload");
  }

  function handlePrevTab() {
    if (activeTab === "media-upload") setActiveTab("video-upload");
    else if (activeTab === "video-upload") setActiveTab("basic-info");
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full max-w-lg bg-white shadow-xl rounded-xl transition-all duration-300"
      >
        <DialogHeader>
          <DialogTitle>Upload Show</DialogTitle>
        </DialogHeader>

        {/* Tabs for different sections of the upload form */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="video-upload">Video Upload</TabsTrigger>
            <TabsTrigger value="media-upload">Media Upload</TabsTrigger>
          </TabsList>

          <div className="min-h-[300px] flex flex-col justify-between">
            <TabsContent value="basic-info">
              <BasicInfoForm
                showFormData={showFormData}
                setShowFormData={setShowFormData}
              />
            </TabsContent>

            <TabsContent value="video-upload">
              <VideoUploadForm
                showFormData={showFormData}
                showVideoFormData={showVideoFormData}
                setShowVideoFormData={setShowVideoFormData}
                handleAddEpisode={handleAddEpisode}
                handleRemoveEpisode={handleRemoveEpisode}
              />
            </TabsContent>

            <TabsContent value="media-upload">
              <MediaUploadForm
                showMediaFormData={showMediaFormData}
                handleImageUpload={handleImageUpload}
              />
            </TabsContent>

            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              {activeTab === "basic-info" ? (
                <>
                  {/* Cancel and Next on the first tab */}
                  <Button onClick={() => setOpenModal(false)}>Cancel</Button>

                  <Button onClick={handleNextTab}>Next</Button>
                </>
              ) : (
                <>
                  {/* Previous and Next/Submit on other tabs */}
                  <Button variant="outline" onClick={handlePrevTab}>
                    Previous
                  </Button>
                  {activeTab !== "media-upload" ? (
                    <Button onClick={handleNextTab}>Next</Button>
                  ) : (
                    <Button onClick={handleSubmit}>Submit</Button>
                  )}
                </>
              )}
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}