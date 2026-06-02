import { toast } from "sonner";

export const appToast = {
  created: (entity: string) => toast.success(`${entity} created successfully`),

  updated: (entity: string) => toast.success(`${entity} updated successfully`),

  deleted: (entity: string) => toast.success(`${entity} deleted successfully`),

  uploadSuccess: (entity: string) =>
    toast.success(`${entity} uploaded successfully`),

  uploadFailed: () => toast.error("Upload failed"),

  error: (message: string) => toast.error(message),
};
