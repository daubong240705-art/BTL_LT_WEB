import { Episode, Movie } from '@/app/types/movie.type';
import { api } from './axios';
import { MovieFormValues } from '../../hooks/movie/useMovieForm';
import { EpisodeFormValues } from '../../hooks/movie/useEpisodeForm';



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

  async getEpisodeByMovie(id: number): Promise<Episode[]> {
    const res = await api.get<Episode[]>(`/episodes/movie/${id}`);
    return res.data;
  },


  async createEpisode(data: EpisodeFormValues & { movieId: number }) {
    const res = await api.post("/episodes", data);
    return res.data;
  },

  async updateEpisode(id: number, data: EpisodeFormValues & { movieId: number }) {
    const res = await api.put(`/episodes/${id}`, data);
    return res.data;
  }
};