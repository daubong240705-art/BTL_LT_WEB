
import { sendRequest } from '@/lib/api/wrapprer';

export type UserPayload = {
  fullName: string;
  username: string;
  email: string;
  role: Role;
  password?: string;
  avatarUrl?: string;
};

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/api/v1";

export const userApi = {
  async getAllAdminUsers(): Promise<User[]> {
    const res = await sendRequest<IBackendRes<IModelPaginate<User>>>({
      url: `${API_URL}/users`,
      method: "GET",
      useCredentials: true,
      auth: true,
    });

    return res.data?.result ?? [];
  },

  async createUser(data: UserPayload) {
    return sendRequest({
      url: `${API_URL}/users`,
      method: "POST",
      body: data,
      useCredentials: true,
      auth: true,
    });
  },

  async updateUser(id: number, data: UserPayload) {
    return sendRequest({
      url: `${API_URL}/users/${id}`,
      method: "PUT",
      body: data,
      useCredentials: true,
      auth: true,
    });
  },

  deleteUser: (id: number) =>
    sendRequest({
      url: `${API_URL}/users/${id}`,
      method: "DELETE",
      useCredentials: true,
      auth: true,
    })



};
