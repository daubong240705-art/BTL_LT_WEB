import { Category, Movie } from "@/app/types/movie.type";


//  Hàm fetch Danh sách phim
export const getMovies = async (): Promise<Movie[]> => {
    const res = await fetch('http://localhost:8080/api/v1/movies', {
    });

    if (!res.ok) {
        throw new Error('Không thể tải danh sách phim');
    }
    return res.json();
}

export const getAllMovieByCategorySlug = async (slug: string): Promise<Movie[]> => {
    const res = await fetch(`http://localhost:8080/api/v1/movies/category/${slug}`, {
    });

    if (!res.ok) {
        throw new Error('Không thể tải danh sách phim');
    }
    return res.json();
}

export const getMovieBySlug = async (slug: string): Promise<Movie> => {
    const res = await fetch(`http://localhost:8080/api/v1/movies/${slug}`)
    if (!res.ok) {
        throw new Error('Không thể tải phim');
    }
    return res.json();
}

// Hàm fetch Thể loại
export const getCategories = async (): Promise<Category[]> => {
    const res = await fetch('http://localhost:8080/api/v1/categories', {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error('Không thể tải danh sách thể loại');
    }
    return res.json();
}


