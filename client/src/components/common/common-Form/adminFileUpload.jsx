/* eslint-disable react/prop-types */
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const AdminFileUpload = ({
  onUpload = () => {},
  accept = "image/*,video/*,.srt,.vtt",
  text = "Upload File",
  file = null, // ✅ Receive file from form (for rehydration)
}) => {
  const inputRef = useRef(null);
  const [localFile, setLocalFile] = useState(file);

  // ✅ Sync the received file with localFile (if switching tabs)
  useEffect(() => {
    if (file) {
      setLocalFile(file);
    }
  }, [file]);

  // ✅ Handle File Upload Click
  function handleClick() {
    if (inputRef.current) inputRef.current.click();
  }

  // ✅ Handle File Selection
  function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      toast.error("❌ File Upload Failed!");
      return;
    }

    // ✅ Generate File URL
    const fileUrl = URL.createObjectURL(selectedFile);

    // ✅ Create File Object
    const fileObj = {
      name: selectedFile.name,
      url: fileUrl,
      type: selectedFile.type,
      size: selectedFile.size,
      raw: selectedFile,
    };

    // ✅ Set File State
    setLocalFile(fileObj);
    onUpload(fileObj);

    toast.success(`✅ ${selectedFile.name} Uploaded Successfully!`);
  }

  // ✅ Handle File Removal
  function handleRemoveFile(event) {
    event.stopPropagation();
    setLocalFile(null);
    onUpload(null);
    toast.success("File Removed Successfully!");
  }

  return (
    <div className="w-full">
      <div
        className="border-2 border-dashed rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center relative"
        onClick={handleClick}
      >
        <Input
          type="file"
          className="hidden"
          ref={inputRef}
          accept={accept}
          onChange={handleFileChange}
        />

        {/* ✅ Show File Preview */}
        {localFile ? (
          <>
            <div
              className="absolute top-2 right-2 bg-red-500 rounded-full p-1 cursor-pointer"
              onClick={handleRemoveFile}
            >
              <XIcon className="w-4 h-4 text-white" />
            </div>

            {/* ✅ Image Preview */}
            {localFile.type.startsWith("image/") && (
              <img
                src={localFile.url}
                alt="Preview"
                className="w-full h-[150px] object-cover rounded-lg"
              />
            )}

            {/* ✅ Video Preview */}
            {localFile.type.startsWith("video/") && (
              <video
                src={localFile.url}
                className="w-full h-[150px] object-cover rounded-lg"
                controls
              />
            )}

            {/* ✅ Subtitle Preview */}
            {(localFile.name.endsWith(".srt") ||
              localFile.name.endsWith(".vtt")) && (
              <div className="text-center text-white">
                <span className="flex justify-center align-middle gap-2">
                  <FileIcon className="w-6 h-6 text-primary" />
                  <p className="font-medium">{localFile.name}</p>
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-gray-400">Click to select {text}</span>
          </>
        )}
      </div>
    </div>
  );
};
