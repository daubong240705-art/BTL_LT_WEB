import { User } from '@/app/types/movie.type';
import { api } from './axios';
import { UserFormValues } from '../../users/hooks/useUserForm';


export const userApi = {
  async getAllAdminUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async createUser(data: UserFormValues) {
    const res = await api.post("/users", data);
    return res.data
  },

  async updateUser(id: number, data: UserFormValues) {
    const res = await api.put(`/users/${id}`, data);
    return res.data
  },

  deleteUser: (id: number) =>
    api.delete(`/users/${id}`)



};