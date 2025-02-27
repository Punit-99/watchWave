/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import BasicInfoForm from "../../components/admin/show-upload/BasicInfoForm";
import VideoUploadForm from "../../components/admin/show-upload/VideoUploadForm";
import MediaUploadForm from "../../components/admin/show-upload/MediaUploadForm";
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
import { ScrollArea } from "../../components/ui/scroll-area";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { uploadMediaFiles } from "../../store/admin-slice/helper/upload-api";
import { addNewShow } from "../../store/admin-slice/admin-slice";
import toast from "react-hot-toast";

export default function ShowUpload() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useOutletContext();

  // Forms (Persisted State)
  const [showFormData, setShowFormData] = useState(showInitialFormData);
  const [showVideoFormData, setShowVideoFormData] = useState([]);
  const [showMediaFormData, setShowMediaFormData] = useState(
    showMediaInitialFormData
  );

  // Tabs state to manage navigation
  const [activeTab, setActiveTab] = useState("basic-info");

  // ✅ Add new episode correctly
  const handleAddEpisode = () => {
    setShowVideoFormData((prev) => [...prev, { title: "", videoFile: null }]);
  };

  // ✅ Remove episode correctly
  function handleRemoveEpisode(index) {
    setShowVideoFormData((prev) => prev.filter((_, i) => i !== index));
  }

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState({
    poster: {},
    thumbnail: {},
    videoFiles: [],
  });
  const [mediaUploaded, setMediaUploaded] = useState(false); // ✅ Track Upload Completion

  // ✅ Upload Media First
  const handleUploadMedia = async () => {
    setIsUploading(true);
    const uploadedMedia = await uploadMediaFiles(
      dispatch,
      showMediaFormData,
      showFormData,
      showVideoFormData
    );

    if (!uploadedMedia) {
      setIsUploading(false);
      return;
    }

    setUploadedData({ ...uploadedMedia });
    setIsUploading(false);
    setMediaUploaded(true); // ✅ Set media uploaded state
    toast.success("Media uploaded successfully!");
  };

  // ✅ Submit Data After Upload
  const handleSubmit = async () => {
    if (!mediaUploaded) {
      toast.error("Please upload media before submitting!");
      return;
    }

    let finalData = {
      ...showFormData,
      poster: uploadedData.poster,
      thumbnail: uploadedData.thumbnail,
      type: showFormData.category, // Ensure this is either 'movie' or 'webseries'
    };

    if (showFormData.category === "movie") {
      // ✅ Structure the movie data properly
      finalData.video = uploadedData.videoFiles[0] || {}; // Ensure only a single video
    } else if (showFormData.category === "webseries") {
      // ✅ Structure the web series episodes properly
      finalData.episodes = showVideoFormData.map((episode, index) => ({
        title: episode.title,
        video: uploadedData.videoFiles[index] || {}, // Ensure the correct video is mapped
      }));
    }

    // Uncomment when ready to submit
    await dispatch(addNewShow(finalData)).unwrap();
    toast.success("Show added successfully!");
    // setOpenModal(false);
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full max-w-lg bg-white shadow-xl rounded-xl transition-all duration-300"
      >
        <DialogHeader>
          <DialogTitle className="mb-5">Upload Show</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="video-upload">Video Upload</TabsTrigger>
            <TabsTrigger value="media-upload">Media Upload</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[520px]">
            <div className="h-[520px] flex flex-col justify-between">
              <div
                style={{
                  display: activeTab === "basic-info" ? "block" : "none",
                }}
              >
                <BasicInfoForm
                  showFormData={showFormData}
                  setShowFormData={setShowFormData}
                />
              </div>

              <div
                style={{
                  display: activeTab === "video-upload" ? "block" : "none",
                }}
              >
                <VideoUploadForm
                  showFormData={showFormData}
                  showVideoFormData={showVideoFormData}
                  setShowVideoFormData={setShowVideoFormData}
                  handleAddEpisode={handleAddEpisode}
                  handleRemoveEpisode={handleRemoveEpisode}
                />
              </div>

              <div
                style={{
                  display: activeTab === "media-upload" ? "block" : "none",
                }}
              >
                <MediaUploadForm
                  showMediaFormData={showMediaFormData}
                  setShowMediaFormData={setShowMediaFormData}
                />
              </div>

              <div className="mt-6 flex justify-between">
                {activeTab === "basic-info" ? (
                  <>
                    <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                    <Button onClick={() => setActiveTab("video-upload")}>
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (activeTab === "media-upload")
                          setActiveTab("video-upload");
                        else if (activeTab === "video-upload")
                          setActiveTab("basic-info");
                      }}
                    >
                      Previous
                    </Button>
                    {activeTab !== "media-upload" ? (
                      <Button
                        onClick={() =>
                          setActiveTab(
                            activeTab === "video-upload"
                              ? "media-upload"
                              : "video-upload"
                          )
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      activeTab === "media-upload" && (
                        <Button
                          onClick={
                            isUploading
                              ? null
                              : mediaUploaded
                              ? handleSubmit
                              : handleUploadMedia
                          }
                          disabled={isUploading}
                        >
                          {isUploading
                            ? "Uploading..."
                            : mediaUploaded
                            ? "Submit"
                            : "Upload"}
                        </Button>
                      )
                    )}
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
