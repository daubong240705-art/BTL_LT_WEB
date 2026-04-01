import { getAdminMovies } from "@/lib/api/admin.api";
import {
    buildAdminMovieFilter,
    DEFAULT_ADMIN_PAGE_SIZE,
    normalizeAdminMovieStatus,
    normalizeAdminMovieType,
    parseAdminPageParam,
    parseAdminTextParam,
    type AdminMovieListState,
} from "@/lib/filter/admin-list";

import MoviesController from "./components/MoviesController";

type MoviesPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: MoviesPageProps) {
    const params = await searchParams;
    const initialState: AdminMovieListState = {
        q: parseAdminTextParam(params.q),
        type: normalizeAdminMovieType(parseAdminTextParam(params.type)),
        status: normalizeAdminMovieStatus(parseAdminTextParam(params.status)),
        page: parseAdminPageParam(params.page),
    };

    const moviesRes = await getAdminMovies({
        filter: buildAdminMovieFilter(initialState),
        page: initialState.page,
        size: DEFAULT_ADMIN_PAGE_SIZE,
    });

    const movies = moviesRes.data?.result ?? [];
    const totalPages = moviesRes.data?.meta?.pages ?? 1;
    const totalItems = moviesRes.data?.meta?.total ?? movies.length;

    return (
        <MoviesController
            key={JSON.stringify(initialState)}
            movies={movies}
            initialState={initialState}
            totalPages={totalPages}
            totalItems={totalItems}
        />
    );
}
