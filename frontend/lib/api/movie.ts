import { Movie } from "@/app/types/movie";

const API_URL = "http://localhost:3001/movies";

export async function createMovie(data: Movie) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Create movie failed");
    return res.json();
}

export async function updateMovie(id: number, data: Movie) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Update movie failed");
    return res.json();

}


