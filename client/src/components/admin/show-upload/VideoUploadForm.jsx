/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import FileUpload from "../File-upload";
import { toast } from "react-hot-toast";

export default function VideoUploadForm({
  showFormData,
  showVideoFormData,
  setShowVideoFormData,
  handleAddEpisode,
  handleRemoveEpisode,
}) {
  // Ensure at least one episode exists for web series
  useEffect(() => {
    if (
      showFormData?.category === "webseries" &&
      showVideoFormData.length === 0
    ) {
      setShowVideoFormData([{ title: "", videoFile: null }]);
    }
  }, [showFormData?.category, showVideoFormData, setShowVideoFormData]);

  // Show a message if category is not selected
  if (!showFormData.category) {
    return (
      <p className="text-red-500 text-center font-semibold">
        Select show category
      </p>
    );
  }

  return (
    <div className="flex flex-col ">
      {showFormData.category === "movie" ? (
        // ✅ Movie: Only One Upload Field
        <FileUpload
          fileType="video"
          setSelectedFiles={(files) =>
            setShowVideoFormData({ videoFile: files[0] })
          }
        />
      ) : (
        // ✅ Web Series: Multiple Episodes with Title & Upload
        <>
          {showVideoFormData.map((episode, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 p-4 rounded-lg bg-gray-100 mt-3"
            >
              {/* Episode Title */}
              <Input
                type="text"
                placeholder={`Episode ${index + 1} Title`}
                value={episode.title}
                onChange={(e) => {
                  let updatedEpisodes = [...showVideoFormData];
                  updatedEpisodes[index].title = e.target.value;
                  setShowVideoFormData(updatedEpisodes);
                }}
                className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Video Upload */}
              <FileUpload
                fileType="video"
                setSelectedFiles={(files) => {
                  let updatedEpisodes = [...showVideoFormData];
                  updatedEpisodes[index].videoFile = files[0];
                  setShowVideoFormData(updatedEpisodes);
                }}
              />

              {/* Remove Episode Button */}
              <Button
                variant="destructive"
                className="w-fit"
                onClick={() => {
                  if (showVideoFormData.length === 1) {
                    toast.error("A web series must have at least one episode.");
                    return;
                  }
                  handleRemoveEpisode(index);
                }}
              >
                Remove Episode
              </Button>
            </div>
          ))}

          {/* Add Episode Button */}
          <div className="flex justify-center mt-5">
            <Button
              variant="outline"
              onClick={handleAddEpisode}
              className="flex items-center justify-center"
            >
              Add Episode
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
