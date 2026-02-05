import { Episode } from "@/app/types/movie";


const API_URL = "http://localhost:3001/episodes";

export const fetchEpisodes = async (): Promise<Episode[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch movies");
    return res.json();
};



export const fetchEpisodesByMovie = async (
    movieId: number
): Promise<Episode[]> => {
    const res = await fetch(`${API_URL}?movie_id=${movieId}`);
    if (!res.ok) throw new Error("Failed to fetch episodes");
    return res.json();
};