import { MoviePayload } from "@/app/types/form.type";
import { adminRequest } from "./adminRequest";
import { getBackendBaseUrl } from "../config/api-url";

const api_url = getBackendBaseUrl();

export type DashboardMovieRanking = {
    id: number
    title: string
    slug: string
    posterUrl: string | null
    publishYear: number | null
    viewCount: number
    favoriteCount: number
}

export type DashboardSummary = {
    totalMovies: number
    totalUsers: number
    totalViews: number
    topViewedMovies: DashboardMovieRanking[]
    topFavoritedMovies: DashboardMovieRanking[]
}

type AdminRequestOptions = {
    cookieHeader?: string
}

type AdminListRequestOptions = AdminRequestOptions & {
    filter?: string
    page?: number
    size?: number
}

const buildAdminListQuery = (options?: AdminListRequestOptions) => ({
    ...(options?.filter ? { filter: options.filter } : {}),
    ...(options?.page ? { page: options.page } : {}),
    ...(options?.size ? { size: options.size } : {}),
})


//Movie
export const getAdminMovies = (options?: AdminListRequestOptions) => {
    return adminRequest<IBackendRes<IModelPaginate<Movie>>>({
        url: `${api_url}/movies`,
        method: "GET",
        cookieHeader: options?.cookieHeader,
        queryParams: buildAdminListQuery(options)
    })
}


export const createMovie = (data: MoviePayload) => {
    return adminRequest<IBackendRes<Movie>>({
        url: `${api_url}/movies`,
        method: "POST",
        body: data
    })
}

export const updateMovie = (id: number, data: MoviePayload) => {
    return adminRequest<IBackendRes<Movie>>({
        url: `${api_url}/movies/${id}`,
        method: "PUT",
        body: data
    })
}


export const deleteMovie = (id: number) => {
    return adminRequest<IBackendRes<boolean>>({
        url: `${api_url}/movies/${id}`,
        method: "DELETE",
    })
}

//Category

export const getAdminCategories = (options?: AdminListRequestOptions) => {
    return adminRequest<IBackendRes<IModelPaginate<Category>>>({
        url: `${api_url}/categories`,
        method: "GET",
        queryParams: buildAdminListQuery(options)
    })
}


//User

export const getAdminUsers = (options?: AdminListRequestOptions) => {
    return adminRequest<IBackendRes<IModelPaginate<User>>>({
        url: `${api_url}/users`,
        method: "GET",
        queryParams: buildAdminListQuery(options)
    })
}

export const getDashboardSummary = (options?: AdminRequestOptions) => {
    return adminRequest<IBackendRes<DashboardSummary>>({
        url: `${api_url}/dashboard/summary`,
        method: "GET",
        cookieHeader: options?.cookieHeader
    })
}
