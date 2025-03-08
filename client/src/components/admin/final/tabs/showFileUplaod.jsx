import { useState } from "react";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { AdminFileUpload } from "../../../common/common-Form/adminFileUpload";

export const ShowFileUpload = ({ category }) => {
  const [episodes, setEpisodes] = useState([
    { title: "", video: null, subtitle: null },
  ]);

  // ✅ Add New Episode
  const handleAddEpisode = () => {
    setEpisodes([...episodes, { title: "", video: null, subtitle: null }]);
  };

  // ✅ Remove Episode (Except 1st)
  const handleRemoveEpisode = (index) => {
    if (episodes.length === 1) {
      toast.error("At least one episode is mandatory.");
      return;
    }
    const updatedEpisodes = episodes.filter((_, i) => i !== index);
    setEpisodes(updatedEpisodes);
  };

  // ✅ Handle File Change
  const handleChange = (index, field, value) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index][field] = value;
    setEpisodes(updatedEpisodes);
  };

  return (
    <div className="flex-1 p-4 bg-gray-700 rounded-md">
      <h2 className="text-lg font-semibold text-white mb-4">
        {category === "movie" ? "Upload Movie & Subtitle" : "Upload Episodes"}
      </h2>

      {category === "movie" ? (
        <>
          <Label className="text-white">Upload Movie</Label>
          <AdminFileUpload
            accept="video/*"
            onUpload={(file) => console.log("Movie File:", file)}
          />
          <Label className="text-white mt-2">Upload Subtitle</Label>
          <AdminFileUpload
            accept=".srt,.vtt"
            onUpload={(file) => console.log("Subtitle File:", file)}
          />
        </>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddEpisode}>+ Add Episode</Button>
          </div>

          {episodes.map((episode, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-800">
              <Input
                value={episode.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="Episode Title"
              />
              <Label>Upload Video</Label>
              <AdminFileUpload
                accept="video/*"
                key={`video-${index}-${Date.now()}`} // ✅ MAGIC FIX
                onUpload={(file) => handleChange(index, "video", file)}
              />
              <Label>Upload Subtitle</Label>
              <AdminFileUpload
                accept=".srt,.vtt"
                key={`subtitle-${index}-${Date.now()}`} // ✅ MAGIC FIX
                onUpload={(file) => handleChange(index, "subtitle", file)}
              />
              {index > 0 && (
                <Button onClick={() => handleRemoveEpisode(index)}>
                  <X size={14} /> Remove
                </Button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
