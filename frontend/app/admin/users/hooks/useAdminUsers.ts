import { User } from '@/app/types/movie.type';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../../service/api/user.api';


export const useAdminUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['admin', 'users'],
    queryFn: userApi.getAllAdminUsers,
    staleTime: 5 * 60 * 1000,
  });
};