export interface LoginResponse {
    firstName: string;
    lastName: string;
    userName: string;
    userCode: number;
    email: string;
    vendor: any | null;
    token: string;
    refreshToken: string;
    roles: string[];
}

export interface RegisterDto {
    firstName?: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
    vendorId?: number;
    role?: string;
}

export interface LoginDto {
    username: string;
    password: string;
}

export interface AuthState {
    user: LoginResponse | null;
    isLoading: boolean;
    error: string | null;
} 