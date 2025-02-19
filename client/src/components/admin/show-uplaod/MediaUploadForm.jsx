/* eslint-disable react/prop-types */
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export default function MediaUploadForm({
  showMediaFormData,
  handleImageUpload,
}) {
  return (
    <div>
      <Label>Upload Poster</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, "poster")}
      />

      <Label>Upload Thumbnails</Label>
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleImageUpload(e, "thumbnail")}
      />

      {/* Preview */}
      {showMediaFormData.posterUrl && (
        <img
          src={showMediaFormData.posterUrl}
          alt="Poster"
          className="mt-4 w-32"
        />
      )}
      {showMediaFormData.thumbnailUrls.map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Thumbnail ${index + 1}`}
          className="mt-4 w-32"
        />
      ))}
    </div>
  );
}
