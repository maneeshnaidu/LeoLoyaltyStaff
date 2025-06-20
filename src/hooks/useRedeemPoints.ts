import { apiClient } from "@/api/client";
import { UpdatePointsDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRedeemPoints = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            customerCode: number;
            data: UpdatePointsDto
        }) => {
            const { customerCode, data } = payload;
            const response = await apiClient.post(
                `/points/redeem/${customerCode}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
            return response.data;
        },
        onError: (error: unknown) => {
            console.error("Redeem reward error:", error);
            console.error(
                error instanceof Error
                    ? error.message
                    : "Failed to redeem reward"
            );
        },
        onSuccess: () => {
            // Invalidate relevant queries after successful redemption
            queryClient.invalidateQueries({
                queryKey: ['rewards']
            });
            queryClient.invalidateQueries({
                queryKey: ['points']
            });
            queryClient.invalidateQueries({
                queryKey: ['transactions']
            });
            console.log("Reward redeemed successfully");
        }
    });
};