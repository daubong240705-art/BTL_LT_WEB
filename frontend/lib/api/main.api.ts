import { sendRequest } from "./wrapprer";


const api_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/public`;

export const getMovies = (filter?: string, page = 1, size = 10) => {
    return sendRequest<IBackendRes<IModelPaginate<Movie>>>({
        url: `${api_url}/movies`,
        method: "GET",
        queryParams: {
            ...(filter ? { filter } : {}),
            page,
            size
        }
    });
};

export const getMoviesByCategorySlug = (slug: string) => {
    return getMovies(`categories.slug:'${slug}'`, 1, 10);
};

export const searchMovies = (
    params: {
        q?: string;
        type?: string;
        category?: string;
        page?: number;
        size?: number;
    }
) => {
    return sendRequest<IBackendRes<IModelPaginate<Movie>>>({
        url: `${api_url}/movies/search`,
        method: "GET",
        queryParams: {
            ...(params.q ? { q: params.q } : {}),
            ...(params.type ? { type: params.type } : {}),
            ...(params.category ? { category: params.category } : {}),
            page: params.page ?? 1,
            size: params.size ?? 10
        }
    });
};

export const getMovieBySlug = (slug: string) => {
    return sendRequest<IBackendRes<Movie>>({
        url: `${api_url}/movies/${slug}`,
        method: "GET"
    });


};

export const getMovieEpisode = (slug: string) => {
    return sendRequest<IBackendRes<IModelPaginate<Episode>>>({
        url: `${api_url}/movies/${slug}/episodes`,
        method: "GET",
    })
};

export const getFirstEpisode = (slug: string) => {
    return sendRequest<IBackendRes<Episode>>({
        url: `${api_url}/movies/first/${slug}`,
        method: "GET",
    })
}

export const getTop5Movie = () => {
    return sendRequest<IBackendRes<Movie[]>>({
        url: `${api_url}/movies/top/5`,
        method: "GET",
    })
}

export const getCategories = () => {
    return sendRequest<IBackendRes<IModelPaginate<Category>>>({
        url: `${api_url}/categories`,
        method: "GET"
    })
}

export const getCommentsByMovieId = (movieId: number, page = 1, size = 5) => {
    return sendRequest<IBackendRes<IModelPaginate<MovieComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/movie/${movieId}`,
        method: "GET",
        queryParams: { page, size },
        useCredentials: true
    });
};

export const createComment = (movie_id: number, content: string) => {
    return sendRequest<IBackendRes<MovieComment>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments`,
        method: "POST",
        body: { movie_id, content },
        useCredentials: true
    });
};

export const deleteComment = (id: number) => {
    return sendRequest<IBackendRes<null>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/${id}`,
        method: "DELETE",
        useCredentials: true
    });
};

export const getAccount = () => {
    return sendRequest<IBackendRes<User>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/account`,
        method: "GET",
        useCredentials: true
    });
};
