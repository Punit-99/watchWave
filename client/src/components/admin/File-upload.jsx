/* eslint-disable react/prop-types */
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

const FileUpload = ({
  fileType = "image",
  setSelectedFiles = () => {}, // Ensure it's always a function
  multiple = false,
  flag = true,
  text,
}) => {
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  function handleClick() {
    if (inputRef.current) inputRef.current.click();
  }

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    event.target.value = ""; // ✅ Reset input field to allow re-selection of the same file

    const updatedFiles = multiple
      ? [...files, ...selectedFiles]
      : selectedFiles;
    setFiles(updatedFiles);
    setSelectedFiles(updatedFiles);
  }

  function handleRemoveFile(event, index) {
    event.stopPropagation(); // ✅ Prevents file dialog from opening
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setSelectedFiles(updatedFiles);
  }

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">
        Upload {flag === true ? fileType : text}
      </Label>
      <div
        className="border-2 border-dashed rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center"
        onClick={handleClick}
      >
        <Input
          type="file"
          className="hidden"
          ref={inputRef}
          accept={fileType === "video" ? "video/*" : "image/*"}
          multiple={multiple}
          onChange={handleFileChange}
        />
        {!files.length ? (
          <div className="flex flex-col items-center">
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Click to select {fileType}</span>
          </div>
        ) : (
          files.map((file, index) => (
            <div key={index} className="flex items-center justify-between mt-2">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
              <p className="text-sm font-medium">{file.name}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={(event) => handleRemoveFile(event, index)} // ✅ Pass event
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* ✅ Image Previews */}
      {fileType === "image" && files.length > 0 && (
        <div className="mt-4 flex gap-2 flex-wrap">
          {files.map((file, index) => (
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-32 h-32 rounded-lg object-cover mt-2"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
