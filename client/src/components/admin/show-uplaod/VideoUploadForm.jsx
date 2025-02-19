/* eslint-disable react/prop-types */
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function VideoUploadForm({
  showFormData,
  showVideoFormData,
  setShowVideoFormData,
  handleVideoUpload,
  handleAddEpisode,
  handleRemoveEpisode,
}) {
  return (
    <div>
      {showFormData.category === "movie" ? (
        <Input
          type="file"
          accept="video/*"
          onChange={(e) => handleVideoUpload(e)}
        />
      ) : (
        <>
          {showVideoFormData.map((episode, index) => (
            <div key={index} className="flex items-center gap-4 mb-4">
              <Input
                type="text"
                placeholder={`Episode ${index + 1} Title`}
                value={episode.title}
                onChange={(e) => {
                  let updatedEpisodes = [...showVideoFormData];
                  updatedEpisodes[index].title = e.target.value;
                  setShowVideoFormData(updatedEpisodes);
                }}
              />
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => handleVideoUpload(e, index)}
              />
              <Button onClick={() => handleRemoveEpisode(index)}>Remove</Button>
            </div>
          ))}
          <Button onClick={handleAddEpisode}>Add Episode</Button>
        </>
      )}
    </div>
  );
}
