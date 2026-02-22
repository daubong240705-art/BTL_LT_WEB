
import { Category } from '@/lib/api/category';
import { api } from './axios';


export const CategoryApi = {

    getAllAdminCategories: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },
};