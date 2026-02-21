import { Category, Movie } from "@/app/types/movie.type";


// 1. Hàm fetch Danh sách phim
export const getMovies = async (): Promise<Movie[]> => {
    const res = await fetch('http://localhost:8080/api/v1/movies', {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error('Không thể tải danh sách phim');
    }
    return res.json();
}

// 2. Hàm fetch Thể loại
export const getCategories = async (): Promise<Category[]> => {
    const res = await fetch('http://localhost:8080/api/v1/categories', {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error('Không thể tải danh sách thể loại');
    }
    return res.json();
}


