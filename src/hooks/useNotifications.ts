import { apiClient } from '@/api/client';
import { useAuthStore } from '@/store/auth';
import { NotificationType } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface NotificationsResponse {
    notifications: NotificationType[];
    totalCount: number;
}

interface NotificationsQueryParams {
    page?: number;
    pageSize?: number;
    isLatest?: boolean;
}

export function useNotifications(params: NotificationsQueryParams = {}) {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery<NotificationsResponse>({
        queryKey: ['notifications', params],
        queryFn: async () => {
            const response = await apiClient.get('/notifications', {
                params: {
                    ...params,
                    userCode: user?.userCode,
                },
            });
            return response;
        },
        enabled: !!user?.userCode,
    });

    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId: number) => {
            await apiClient.put(`/notifications/${notificationId}/read`);
        },
        onSuccess: () => {
            // Invalidate notifications query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            await apiClient.put('/notifications/read-all', {
                userCode: user?.userCode,
            });
        },
        onSuccess: () => {
            // Invalidate notifications query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: async (notificationId: number) => {
            await apiClient.delete(`/notifications/${notificationId}`);
        },
        onSuccess: () => {
            // Invalidate notifications query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    return {
        notifications: data?.notifications ?? [],
        totalCount: data?.totalCount ?? 0,
        isLoading,
        error,
        refetch,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        deleteNotification: deleteNotificationMutation.mutate,
        isMarkingAsRead: markAsReadMutation.isPending,
        isMarkingAllAsRead: markAllAsReadMutation.isPending,
        isDeleting: deleteNotificationMutation.isPending,
    };
}
