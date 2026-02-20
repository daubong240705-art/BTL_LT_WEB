
export type MovieType = 'SINGLE' | 'SERIES';
export type MovieStatus = 'ONGOING' | 'COMPLETED';

export interface Category {
    id: number;
    name: string;
    slug: string;
}

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
    createdAt: string;
    updatedAt: string;
    categories: Category[];
}