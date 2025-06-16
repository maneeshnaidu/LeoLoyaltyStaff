import { jwtDecode } from 'jwt-decode';
import { LoginResponse } from '@/types/auth';

interface DecodedToken {
    exp: number;
    iat: number;
    sub: string;
}

export const isTokenValid = (token: string): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch {
        return false;
    }
};

export const isRefreshTokenValid = (refreshToken: string): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(refreshToken);
        const currentTime = Date.now() / 1000;
        // Refresh tokens typically have a longer expiration time
        return decoded.exp > currentTime;
    } catch {
        return false;
    }
};

export const validateAuthState = (authState: LoginResponse | null): boolean => {
    if (!authState?.token) return false;

    // If access token is valid, return true
    if (isTokenValid(authState.token)) return true;

    // If access token is invalid but refresh token is valid, return true
    // The AuthGuard will handle the token refresh
    if (authState.refreshToken && isRefreshTokenValid(authState.refreshToken)) return true;

    return false;
}; 