/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminFileUpload } from "../../../common/common-Form/adminFileUpload";

export const ShowFileUpload = ({ category }) => {
  const [episodes, setEpisodes] = useState([
    {
      title: "",
      video: null,
      subtitle: null,
    },
  ]);

  // ✅ Handle Adding Episode
  const handleAddEpisode = () => {
    setEpisodes([
      ...episodes,
      {
        title: "",
        video: null,
        subtitle: null,
      },
    ]);
  };

  // ✅ Handle Removing Episode (except first)
  const handleRemoveEpisode = (index) => {
    if (episodes.length === 1) {
      toast.error("At least one episode is mandatory");
      return;
    }
    const updatedEpisodes = episodes.filter((_, i) => i !== index);
    setEpisodes(updatedEpisodes);
    toast.success("Episode Removed");
  };

  // ✅ Handle Field Changes
  const handleChange = (index, field, value) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index][field] = value;
    setEpisodes(updatedEpisodes);
  };

  if (!category) {
    return (
      <div className="text-center text-white">
        ❌ Please select a category first.
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 bg-gray-700 rounded-md">
      <h2 className="text-lg font-semibold text-white mb-4">
        {category === "movie"
          ? "Upload Movie File & Subtitle"
          : "Upload Episodes & Subtitles"}
      </h2>

      {category === "movie" ? (
        <>
          {/* File Upload for Movie */}
          <div className="mb-4">
            <Label className="text-white">Upload Movie</Label>
            <AdminFileUpload
              accept="video/*"
              onUpload={(file) => console.log("Movie Uploaded:", file)}
            />
          </div>

          {/* Subtitle Upload */}
          <div className="mb-4">
            <Label className="text-white">Upload Subtitle</Label>
            <AdminFileUpload
              accept=".vtt,.srt"
              onUpload={(file) => console.log("Subtitle Uploaded:", file)}
            />
          </div>
        </>
      ) : (
        <>
          {/* Button to Add Episode */}
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddEpisode} variant="secondary">
              + Add Episode
            </Button>
          </div>

          {/* Render Episode Blocks */}
          {episodes.map((episode, index) => (
            <div
              key={index}
              className="p-4 mb-4 border border-gray-600 rounded-md bg-gray-800 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">
                  Episode {index + 1}
                </h3>

                {/* Remove Button */}
                {index > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveEpisode(index)}
                  >
                    <X size={14} /> Remove
                  </Button>
                )}
              </div>

              {/* Episode Title */}
              <div className="mb-4">
                <Label className="text-white">Episode Title</Label>
                <Input
                  type="text"
                  placeholder="Enter Episode Title"
                  value={episode.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="text-white bg-gray-800 border-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              {/* Episode Video Upload */}
              <div className="mb-4">
                <Label className="text-white">Upload Episode Video</Label>
                <AdminFileUpload
                  accept="video/*"
                  onUpload={(file) => handleChange(index, "video", file)}
                />
              </div>

              {/* Episode Subtitle Upload */}
              <div className="mb-4">
                <Label className="text-white">Upload Subtitle</Label>
                <AdminFileUpload
                  accept=".vtt,.srt"
                  onUpload={(file) => handleChange(index, "subtitle", file)}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
