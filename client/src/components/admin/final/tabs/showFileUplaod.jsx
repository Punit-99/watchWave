import { useEffect, useState } from "react";
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

  // ✅ Reset Episodes When Category Changes 🔥
  useEffect(() => {
    setEpisodes([{ title: "", video: null, subtitle: null }]);
  }, [category]);

  // ✅ Handle Add Episode 🔥
  const handleAddEpisode = () => {
    setEpisodes([...episodes, { title: "", video: null, subtitle: null }]);
  };

  // ✅ Handle Remove Episode 🔥
  const handleRemoveEpisode = (index) => {
    if (episodes.length === 1) {
      toast.error("At least one episode is mandatory.");
      return;
    }
    const updatedEpisodes = episodes.filter((_, i) => i !== index);
    setEpisodes(updatedEpisodes);
  };

  // ✅ Handle File & Text Change 🔥
  const handleChange = (index, field, value) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index][field] = value;
    setEpisodes(updatedEpisodes);
  };

  if (!category) {
    return "Choose Category";
  }

  return (
    <div className="flex-1 p-4 bg-gray-700 rounded-md">
      <h2 className="text-lg font-semibold text-white mb-4">
        {category === "movie" ? "Upload Movie & Subtitle" : "Upload Episodes"}
      </h2>

      {/* ✅ IF CATEGORY IS MOVIE */}
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

          {/* ✅ LOOP THROUGH EPISODES (FIXED LAYOUT) */}
          {episodes.map((episode, index) => (
            <div
              key={index}
              className="p-4 border rounded-md bg-gray-800 mb-4 relative"
            >
              {/* ✅ REMOVE BUTTON AT TOP RIGHT */}
              <div className="w-full flex justify-end mb-2.5">
                {index > 0 && (
                  <Button
                    className="flex flex-row-reverse bg-red-900"
                    onClick={() => handleRemoveEpisode(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
              {/* ✅ EPISODE TITLE */}{" "}
              <Label className="text-white mt-2">Episode {index + 1}</Label>
              <Input
                value={episode.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder={`Episode ${index + 1} Title`}
              />
              {/* ✅ VIDEO UPLOAD */}
              <Label className="text-white mt-2">Upload Video</Label>
              <AdminFileUpload
                accept="video/*"
                onUpload={(file) => handleChange(index, "video", file)}
              />
              {/* ✅ VIDEO PREVIEW */}
              {episode.video && (
                <div
                  className="border-2 border-dashed rounded-lg flex items-center justify-center w-full h-[120px] cursor-pointer mt-2"
                  onClick={() => handleChange(index, "video", null)}
                >
                  <video
                    src={URL.createObjectURL(episode.video)}
                    className="w-full h-full object-cover rounded-md"
                    controls
                  />
                </div>
              )}
              {/* ✅ SUBTITLE UPLOAD */}
              <Label className="text-white mt-2">Upload Subtitle</Label>
              <AdminFileUpload
                accept=".srt,.vtt"
                onUpload={(file) => handleChange(index, "subtitle", file)}
              />
              {/* ✅ SUBTITLE PREVIEW */}
              {episode.subtitle && (
                <div className="border-2 border-dashed rounded-lg flex items-center justify-between bg-gray-900 p-2 text-white mt-2">
                  <span>{episode.subtitle.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleChange(index, "subtitle", null)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};
