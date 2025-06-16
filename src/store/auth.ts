import { apiClient } from '@/api/client';
import { tokenService } from '@/services/token';
import { AuthState, LoginResponse } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TokenResponse {
    token: string;
    refreshToken: string;
}

interface AuthStore extends AuthState {
    setUser: (user: LoginResponse | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
    refreshToken: () => Promise<boolean>;
    isHydrated: boolean;
    setHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,
            isHydrated: false,
            setHydrated: (state) => set({ isHydrated: state }),
            setUser: async (user) => {
                if (user) {
                    await tokenService.setTokens(user.token, user.refreshToken);
                } else {
                    await tokenService.clearTokens();
                }
                set({ user });
            },
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            logout: async () => {
                await tokenService.clearTokens();
                set({ user: null, error: null });
            },
            refreshToken: async () => {
                const currentUser = get().user;
                if (!currentUser?.refreshToken) return false;

                try {
                    set({ isLoading: true });
                    const response = await apiClient.post<TokenResponse>('/auth/refresh-token', {
                        refreshToken: currentUser.refreshToken,
                    });

                    const newUser: LoginResponse = {
                        ...currentUser,
                        token: response.token,
                        refreshToken: response.refreshToken,
                    };

                    await tokenService.setTokens(response.token, response.refreshToken);
                    set({ user: newUser, error: null });
                    return true;
                } catch (error) {
                    set({ error: 'Failed to refresh token', user: null });
                    return false;
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                // Called after hydration is finished
                if (state) {
                    state.setHydrated(true);
                }
            },
        }
    )
); 