import { Movie } from '@/app/types/movie.type';
import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../service/movie.api';


export const useAdminMovies = () => {
    return useQuery<Movie[], Error>({
        // queryKey giúp React Query phân biệt và cache dữ liệu API này
        queryKey: ['admin', 'movies'],
        // queryFn là hàm gọi API thực tế
        queryFn: movieApi.getAllAdminMovies,
        // (Tùy chọn) Cấu hình thêm: Dữ liệu sẽ cũ (stale) sau 5 phút
        staleTime: 5 * 60 * 1000,
    });
};