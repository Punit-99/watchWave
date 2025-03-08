/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { X } from "lucide-react";
import { UploadIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export const AdminFileUpload = ({
  onUpload = () => {},
  accept = "image/*", // ✅ Dynamic Accept Type
}) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  // ✅ Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // ✅ Generate Local Preview URL
    const fileURL = URL.createObjectURL(selectedFile);
    setFile(selectedFile);
    setFileUrl(fileURL);

    // ✅ Send File To Parent Form
    onUpload(fileURL);
    toast.success("File Selected Successfully");
  };

  // ✅ Handle File Removal
  const handleRemoveFile = () => {
    setFile(null);
    setFileUrl(null);
    onUpload(null);
    toast.success("File Removed");
  };

  return (
    <div className="w-full h-[120px] border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center relative bg-gray-800">
      {/* ✅ If No File Selected */}
      {!fileUrl && (
        <div className="text-center text-gray-400">
          <label htmlFor="fileUpload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <UploadIcon size={20} />
              <span className="text-xs mt-2">Upload File</span>
            </div>
          </label>
          <input
            type="file"
            id="fileUpload"
            accept={accept}
            onChange={handleFileChange}
            hidden
          />
        </div>
      )}

      {/* ✅ If File Uploaded */}
      {fileUrl && (
        <div className="relative w-full h-full flex items-center justify-center">
          {accept.includes("video") ? (
            <video
              src={fileUrl}
              className="w-full h-full object-cover rounded-lg"
              controls
            />
          ) : (
            <img
              src={fileUrl}
              className="w-full h-full object-cover rounded-lg"
              alt="Uploaded File"
            />
          )}

          {/* ✅ Remove File Button */}
          <button
            className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white"
            onClick={handleRemoveFile}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
