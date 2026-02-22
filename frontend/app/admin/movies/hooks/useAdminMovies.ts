import { Movie } from '@/app/types/movie.type';
import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../../service/api/movie.api';


export const useAdminMovies = () => {
    return useQuery<Movie[], Error>({
        // queryKey giúp React Query phân biệt và cache dữ liệu API này
        queryKey: ['movies'],
        // queryFn là hàm gọi API thực tế
        queryFn: movieApi.getAllAdminMovies,
    });
};