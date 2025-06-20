import { apiClient } from "@/api/client";
import { RewardType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetUserRewards = (outletId: number, customerCode: number, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['rewards', { outletId, customerCode }],
        queryFn: async () => {
            try {
                const response = await apiClient.get<RewardType[]>(
                    `/rewards/get-rewards/${outletId}/${customerCode}`);
                return response;
            } catch (error) {
                console.error('Failed to fetch rewards:', error);
                throw error; // Let react-query handle the error
            }
        },
        enabled,
    });
};