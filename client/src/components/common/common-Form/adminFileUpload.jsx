/* eslint-disable react/prop-types */
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useRef, useState } from "react";
import { Button } from "../../ui/button";
import { toast } from "react-hot-toast";

export const AdminFileUpload = ({
  onUpload = () => {}, // ✅ It will directly pass fileUrl to FormData
  accept = "image/*",
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
    if (!selectedFile) return;

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

    // ✅ Show Success Toast
    toast.success(`${selectedFile.name} Uploaded Successfully!`);
  }

  // ✅ Handle File Removal
  function handleRemoveFile(event) {
    event.stopPropagation();
    setFile(null);
    onUpload(""); // ✅ Pass Empty URL to FormData
    toast.success("File Removed Successfully!");
  }

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">{text}</Label>

      {/* ✅ File Upload Box */}
      <div
        className="border-2 border-dashed rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center"
        onClick={handleClick}
      >
        <Input
          type="file"
          className="hidden"
          ref={inputRef}
          accept={accept}
          onChange={handleFileChange}
        />

        {/* ✅ If No File */}
        {!file ? (
          <div className="flex flex-col items-center">
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Click to select {text}</span>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between bg-gray-800 text-white p-2 rounded-lg">
              {/* ✅ File Name */}
              <div className="flex items-center gap-2">
                <FileIcon className="w-6 text-primary h-6" />
                <p className="text-sm font-medium">{file.name}</p>
              </div>

              {/* ✅ Remove File */}
              <Button variant="ghost" size="icon" onClick={handleRemoveFile}>
                <XIcon className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ File Preview */}
      {file && (
        <div className="mt-4 border rounded-lg overflow-hidden">
          {file.type.startsWith("image/") && (
            <img
              src={file.url}
              alt="Preview"
              className="w-full h-32 object-cover"
            />
          )}
          {file.type.startsWith("video/") && (
            <video
              src={file.url}
              className="w-full h-32 object-cover"
              controls
            />
          )}
        </div>
      )}
    </div>
  );
};
