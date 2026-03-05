import { sendRequest } from "./wrapprer";


const api_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/public`;

export const getMovies = (filter?: string) => {
    return sendRequest<IBackendRes<IModelPaginate<Movie>>>({
        url: `${api_url}/movies`,
        method: "GET",
        queryParams: filter ? { filter } : {}
    });
};

export const getMoviesByCategorySlug = (slug: string) => {
    return getMovies(`categories.slug:'${slug}'`);
};

export const getMovieBySlug = (slug: string) => {
    return sendRequest<IBackendRes<Movie>>({
        url: `${api_url}/movies/${slug}`,
        method: "GET"
    });


};

export const getCategories = () => {
    return sendRequest<IBackendRes<IModelPaginate<Category>>>({
        url: `${api_url}/categories`,
        method: "GET"
    })
}