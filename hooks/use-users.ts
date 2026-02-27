import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

interface UseUsersParams {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
}

export const useUsers = (params?: UseUsersParams) => {
    return useQuery({
        queryKey: ['users', params],
        queryFn: () => apiClient.users.getAll(params),
    });
};
