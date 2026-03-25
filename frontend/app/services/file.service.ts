import { sendRequest } from "@/lib/api/wrapprer";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/api/v1";

export type UploadImageFolder = "avatars" | "movies/posters" | "movies/thumbs";

export type UploadFilePayload = {
  fileName: string;
  fileUrl: string;
  relativePath: string;
};

export const fileApi = {
  uploadImage(file: File, folder: UploadImageFolder) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return sendRequest<IBackendRes<UploadFilePayload>>({
      url: `${API_URL}/files`,
      method: "POST",
      body: formData,
      useCredentials: true,
      auth: true,
      redirectOnAuthFail: false,
    });
  },
};
