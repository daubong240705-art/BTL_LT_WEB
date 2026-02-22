import { User } from '@/app/types/movie.type';
import { api } from './axios';


export const userApi = {
  getAllAdminUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },
};