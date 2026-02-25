

import { api } from './axios';
import { CategoryFormValues } from '../../hooks/category/useCategoryForm';
import { Category } from '@/app/types/movie.type';


export const categoryApi = {

    async getAllAdminCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    async createCategory(data: CategoryFormValues) {
        const res = await api.post("/categories", data);
        return res.data
    },

    async updateCategory(id: number, data: CategoryFormValues) {
        const res = await api.put(`/categories/${id}`, data);
        return res.data
    },

    deleteCategory: (id: number) =>
        api.delete(`/categories/${id}`)

};