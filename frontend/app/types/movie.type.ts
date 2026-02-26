
export type MovieType = 'SINGLE' | 'SERIES';
export type MovieStatus = 'ONGOING' | 'COMPLETED';
export type Role = 'ADMIN' | 'USER';

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    role: Role;
    createdAt: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Episode {
    id: number;
    movie_id: number;
    name: string;
    slug: string;
    video_url: string;
    episode_order: number;
};

export interface Movie {
    id: number;
    title: string;
    description: string;
    type: MovieType;
    status: MovieStatus;
    posterUrl: string;
    thumbUrl: string;
    publishYear: number;
    viewCount: number;
    slug: string;
    categories: Category[];
}

export interface MovieRequest {
    id: number;
    title: string;
    description: string;
    type: MovieType;
    status: MovieStatus;
    posterUrl: string;
    thumbUrl: string;
    publishYear: number;
    viewCount: number;
    slug: string;
    createdAt: string;
    updatedAt: string;
    categories: string[];
}