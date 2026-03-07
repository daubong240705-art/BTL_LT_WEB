import { sendRequest } from "@/lib/api/wrapprer";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080/api/v1";

export type MoviePayload = {
    title: string;
    slug: string;
    description: string;
    type: MovieType;
    status: MovieStatus;
    posterUrl?: string;
    thumbUrl?: string;
    publishYear: number;
    categoryIds: number[];
};

export type EpisodePayload = {
    movieId: number;
    name: string;
    slug: string;
    videoUrl: string;
    episodeOrder: number;
};

export const movieApi = {
    async getAllAdminMovies(): Promise<Movie[]> {
        const res = await sendRequest<IBackendRes<IModelPaginate<Movie>>>({
            url: `${API_URL}/movies`,
            method: "GET",
            useCredentials: true,
            auth: true,
        });

        return res.data?.result ?? [];
    },

    createMovie(data: MoviePayload) {
        return sendRequest<IBackendRes<Movie>>({
            url: `${API_URL}/movies`,
            method: "POST",
            body: data,
            useCredentials: true,
            auth: true,
        });
    },

    updateMovie(id: number, data: MoviePayload) {
        return sendRequest<IBackendRes<Movie>>({
            url: `${API_URL}/movies/${id}`,
            method: "PUT",
            body: data,
            useCredentials: true,
            auth: true,
        });
    },

    deleteMovie(id: number) {
        return sendRequest<IBackendRes<void>>({
            url: `${API_URL}/movies/${id}`,
            method: "DELETE",
            useCredentials: true,
            auth: true,
        });
    },

    async getEpisodeByMovie(movieId: number): Promise<Episode[]> {
        const res = await sendRequest<IBackendRes<Episode[]>>({
            url: `${API_URL}/movies/${movieId}/episodes`,
            method: "GET",
            useCredentials: true,
            auth: true,
        });

        return res.data ?? [];
    },

    createEpisode(data: EpisodePayload) {
        return sendRequest<IBackendRes<Episode>>({
            url: `${API_URL}/episodes`,
            method: "POST",
            body: data,
            useCredentials: true,
            auth: true,
        });
    },

    updateEpisode(id: number, data: EpisodePayload) {
        return sendRequest<IBackendRes<Episode>>({
            url: `${API_URL}/episodes/${id}`,
            method: "PUT",
            body: data,
            useCredentials: true,
            auth: true,
        });
    },

    deleteEpisode(id: number) {
        return sendRequest<IBackendRes<void>>({
            url: `${API_URL}/episodes/${id}`,
            method: "DELETE",
            useCredentials: true,
            auth: true,
        });
    },
};
