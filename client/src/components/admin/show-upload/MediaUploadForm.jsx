/* eslint-disable react/prop-types */
import FileUpload from "../File-upload"; // Import the FileUpload component

export default function MediaUploadForm({
  // showMediaFormData,
  setShowMediaFormData,
}) {
  return (
    <div>
      {/* Poster Upload */}
      <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-100 mt-3">
        <FileUpload
          fileType="image"
          flag={false}
          text={"Poster"}
          setSelectedFiles={(files) =>
            setShowMediaFormData((prev) => ({
              ...prev,
              poster: files[0], // ✅ Update showMediaFormData directly
            }))
          }
        />
      </div>
      {/* Thumbnails Upload */}

      <div className="flex flex-col gap-4 p-4 rounded-lg bg-gray-100 mt-3">
        <FileUpload
          fileType="image"
          flag={false}
          text={"Thumbnails"}
          setSelectedFiles={(files) =>
            setShowMediaFormData((prev) => ({
              ...prev,
              thumbnail: files[0], // ✅ Update showMediaFormData directly
            }))
          }
        />
      </div>
    </div>
  );
}
