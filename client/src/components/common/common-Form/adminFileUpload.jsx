/* eslint-disable react/prop-types */
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../../ui/input";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFile,
  uploadFile,
} from "../../../store/admin-slice/upload-slice";
import { Skeleton } from "@/components/ui/skeleton";

export const AdminFileUpload = ({
  onUpload = () => {},
  accept = "image/*,video/*,.srt,.vtt",
  text = "Upload File",
  file = null, // ✅ Used for rehydration
}) => {
  const inputRef = useRef(null);
  const [localFile, setLocalFile] = useState(file);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.upload.isLoading);

  // ✅ Rehydrate from parent form
  useEffect(() => {
    if (file && !localFile) {
      setLocalFile(file);
    }
  }, [file]);

  function handleClick() {
    if (inputRef.current) inputRef.current.click();
  }

  async function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      toast.error("❌ File Upload Failed!");
      return;
    }

    const fileObj = {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
      raw: selectedFile,
      url: null, // to be filled after Cloudinary upload
      public_id: null,
    };

    setLocalFile(fileObj); // Temporarily show "Uploading..."
    try {
      const res = await dispatch(uploadFile({ file: selectedFile })).unwrap();
      const updatedFileObj = {
        ...fileObj,
        url: res.secure_url,
        public_id: res.public_id, // ✅ Add this
      };
      setLocalFile(updatedFileObj);
      onUpload(updatedFileObj);
      toast.success(`✅ ${selectedFile.name} Uploaded Successfully!`);
    } catch (err) {
      setLocalFile(null);
      toast.error("❌ Upload Failed");
    }
  }

  async function handleRemoveFile(event) {
    event.stopPropagation();

    if (localFile?.public_id) {
      try {
        await dispatch(deleteFile({ public_id: localFile.public_id })).unwrap();
        toast.success("✅ File Removed from Cloudinary!");
      } catch (err) {
        toast.error("❌ Failed to delete from Cloudinary");
      }
    }

    setLocalFile(null);
    onUpload(null);
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

        {localFile ? (
          <>
            <div
              className="absolute top-2 right-2 bg-red-500 rounded-full p-1 cursor-pointer z-10"
              onClick={handleRemoveFile}
            >
              <XIcon className="w-4 h-4 text-white" />
            </div>

            {isLoading || !localFile.url ? (
              <Skeleton className="w-full h-[150px] object-cover rounded-lg bg-[#262628]" />
            ) : (
              // <div className="flex flex-col items-center text-gray-400">
              //
              // </div>
              <>
                {/* 🖼️ Image Preview */}
                {localFile.type.startsWith("image/") && (
                  <img
                    src={localFile.url}
                    alt="Preview"
                    className="w-full h-[150px] object-cover rounded-lg"
                  />
                )}

                {/* 🎥 Video Preview */}
                {localFile.type.startsWith("video/") && (
                  <video
                    src={localFile.url}
                    className="w-full h-[150px] object-cover rounded-lg"
                    controls
                  />
                )}

                {/* 📄 Subtitle File */}
                {(localFile.name.endsWith(".srt") ||
                  localFile.name.endsWith(".vtt")) && (
                  <div className="text-center text-white">
                    <span className="flex justify-center items-center gap-2">
                      <FileIcon className="w-6 h-6 text-primary" />
                      <p className="font-medium">{localFile.name}</p>
                    </span>
                  </div>
                )}
              </>
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
