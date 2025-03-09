/* eslint-disable react/prop-types */
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

export const AdminFileUpload = ({
  onUpload = () => {}, // ✅ It will directly pass fileUrl to FormData
  accept = "image/*,video/*,.srt,.vtt",
  text = "Upload File",
}) => {
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

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

    // ✅ Reset Input Lock
    event.target.value = "";

    // ✅ Generate File URL
    const fileUrl = URL.createObjectURL(selectedFile);

    // ✅ Save File State
    setFile({
      name: selectedFile.name,
      url: fileUrl,
      type: selectedFile.type,
      size: selectedFile.size,
      raw: selectedFile,
    });

    // ✅ Pass File URL Directly to FormData
    onUpload(fileUrl);

    // ✅ Show Confirmation Based on File Type
    if (selectedFile.type.startsWith("video/")) {
      toast.success("✅ Video File Selected!");
    } else if (
      selectedFile.name.endsWith(".srt") ||
      selectedFile.name.endsWith(".vtt")
    ) {
      toast.success("✅ Subtitle File Selected!");
    } else {
      toast.success(`✅ ${selectedFile.name} Uploaded Successfully!`);
    }
  }

  // ✅ Handle File Removal
  function handleRemoveFile(event) {
    event.stopPropagation();
    setFile(null);
    onUpload(""); // ✅ Pass Empty URL to FormData
    toast.success("File Removed Successfully!");
  }

  return (
    <div className="w-full">
      {/* ✅ UPLOAD BOX */}
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

        {/* ✅ FILE PREVIEW INSIDE BOX */}
        {file ? (
          <>
            {/* ✅ REMOVE BUTTON INSIDE THE BOX */}
            <div
              className="absolute top-2 right-2 bg-red-500 rounded-full p-1 cursor-pointer"
              onClick={handleRemoveFile}
            >
              <XIcon className="w-4 h-4 text-white" />
            </div>

            {/* ✅ IF IMAGE */}
            {file.type.startsWith("image/") && (
              <img
                src={file.url}
                alt="Preview"
                className="w-full h-[150px] object-none rounded-lg "
              />
            )}

            {/* ✅ IF VIDEO */}
            {file.type.startsWith("video/") && (
              <video
                src={file.url}
                className="w-full h-[150px] object-none rounded-lg"
                controls
              />
            )}

            {/* ✅ IF SUBTITLE */}
            {(file.name.endsWith(".srt") || file.name.endsWith(".vtt")) && (
              <div className="text-center text-white">
                <span className="flex justify-center align-middle text-center gap-2">
                  <FileIcon className="w-6 h-6 text-primary" />
                  <p className=" font-medium ">{file.name}</p>
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            {/* ✅ DEFAULT UPLOAD AREA */}
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span className="text-gray-400">Click to select {text}</span>
          </>
        )}
      </div>
    </div>
  );
};
