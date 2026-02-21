
import { Category } from '@/lib/api/category';
import axios from 'axios';



const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const CategoryApi = {

    getAllAdminCategories: async (): Promise<Category[]> => {
        const response = await apiClient.get<Category[]>('/categories');
        return response.data;
    },
};