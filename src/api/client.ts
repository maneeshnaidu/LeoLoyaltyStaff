import { tokenService } from '@/services/token';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

class ApiClient {
    private client: AxiosInstance;
    private static instance: ApiClient;

    private constructor() {
        this.client = axios.create({
            baseURL: process.env.EXPO_PUBLIC_API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = tokenService.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config as CustomAxiosRequestConfig;
                if (!originalRequest) return Promise.reject(error);

                // If error is 401 and we haven't tried to refresh the token yet
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = tokenService.getRefreshToken();
                        if (!refreshToken) {
                            throw new Error('No refresh token available');
                        }

                        const response = await this.client.post('/auth/refresh-token', {
                            refreshToken,
                        });

                        const { token, refreshToken: newRefreshToken } = response.data;
                        await tokenService.setTokens(token, newRefreshToken);

                        // Retry the original request with the new token
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        // If refresh token fails, clear tokens
                        await tokenService.clearTokens();
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiClient = ApiClient.getInstance();