import { CreateMovieRequest, Movie } from "@/app/types/movie";

const API_URL = "http://localhost:3001/movies";

export async function createMovie(data: CreateMovieRequest) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Create movie failed");
    return res.json();
}

export async function updateMovie(id: number, data: CreateMovieRequest) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Update movie failed");
    return res.json();
}

export const fetchMovies = async (): Promise<Movie[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch movies");
    return res.json();
};
