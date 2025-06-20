import { apiClient } from "@/api/client";
import { UpdatePointsDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddPoints = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: {
            customerCode: number
            data: UpdatePointsDto
        }) => {
            const { customerCode, data } = payload
            const response = await apiClient.post(
                `/points/${customerCode}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            return response.data
        },
        onError: (error: unknown) => {
            console.error("Add points error:", error)
            console.error(
                error instanceof Error
                    ? error.message
                    : "Failed to add points"
            )
        },
        onSuccess: () => {
            // Invalidate relevant queries after successful addition
            // queryClient.invalidateQueries({
            //     queryKey: ['points']
            // })
            queryClient.invalidateQueries({
                queryKey: ['transactions']
            })
            console.log("Points added successfully")
        }
    })
}