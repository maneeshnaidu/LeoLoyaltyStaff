import { apiClient } from '@/api/client';
import { LoginDto, LoginResponse } from '@/types/auth';

interface TokenResponse {
    token: string;
    refreshToken: string;
}

class AuthService {
    private static instance: AuthService;
    private readonly BASE_URL = '/auth';

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async login(credentials: LoginDto): Promise<LoginResponse> {
        try {
            const response = await apiClient.post<LoginResponse>(`${this.BASE_URL}/login`, credentials);
            return response as LoginResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async refreshToken(refreshToken: string): Promise<TokenResponse> {
        try {
            const response = await apiClient.post<TokenResponse>(
                `${this.BASE_URL}/refresh-token`,
                { refreshToken }
            );
            return response as TokenResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async logout(): Promise<void> {
        try {
            await apiClient.post(`${this.BASE_URL}/logout`);
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (error.response?.data?.message) {
            return new Error(error.response.data.message);
        }
        return new Error('An unexpected error occurred');
    }
}

export const authService = AuthService.getInstance(); 