import { Movie } from '@/app/types/movie.type';
import axios from 'axios';



const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const movieApi = {

  getAllAdminMovies: async (): Promise<Movie[]> => {
    const response = await apiClient.get<Movie[]>('/movies');
    return response.data;
  },
};