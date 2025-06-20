import { apiClient } from "@/api/client";
import { QueryObject, TransactionType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTransactions = (query?: QueryObject) => {
    return useQuery({
        queryKey: ['transactions', query],
        queryFn: async () => {
            try {
                const response = await apiClient.get<TransactionType[]>('/transactions', {
                    params: query
                });
                return response;
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                throw error; // Let react-query handle the error
            }
        },
    });
};