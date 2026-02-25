
import MoviesController from "./components/MoviesController";

export default async function Page() {
    const res = await fetch("http://localhost:8080/api/v1/movies", {
        cache: "no-store",
    });

    const movies = await res.json();

    return <MoviesController movies={movies} />;
}