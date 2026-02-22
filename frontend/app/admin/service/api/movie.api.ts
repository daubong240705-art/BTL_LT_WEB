import { Movie } from '@/app/types/movie.type';
import { api } from './axios';
import { MovieFormValues } from '../../movies/hooks/useMovieForm';


export const movieApi = {
  async getAllAdminMovies(): Promise<Movie[]> {
    const response = await api.get<Movie[]>('/movies');
    return response.data;
  },

  async createMovie(data: MovieFormValues) {
    const res = await api.post("/movies", data);
    return res.data;
  },

  async updateMovie(id: number, data: MovieFormValues) {
    const res = await api.put(`/movies/${id}`, data);
    return res.data;
  },
  deleteMovie: (id: number) =>
    api.delete(`/movies/${id}`),
};